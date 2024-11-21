// Customizable Area Start
import React from 'react';
import { IBlock } from '../../../framework/src/IBlock';
import { BlockComponent } from '../../../framework/src/BlockComponent';
import { Message } from '../../../framework/src/Message';
import MessageEnum, {
  getName,
} from '../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../framework/src/RunEngine';

import { getStorageData } from '../../../framework/src/Utilities';
import { Alert, Platform } from 'react-native';
import { ChangeEvent } from 'react';
import { Typography } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { toast } from 'react-toastify';

let ImagePicker: {
  openPicker: (arg0: {
    width: number;
    height: number;
    cropping: boolean;
  }) => Promise<Image>;
};
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  ImagePicker = require('react-native-image-crop-picker');
}

interface ErrorState {
  [errorKey: string]: string;
}

type Errors = {
  [errorKey: string]: boolean;
};

interface Response {
  membership: any;
  errors?: {
    message: string;
  }[];
  data: MemberType[];
}
interface Image {
  path: string;
  mime: string;
}
interface MemberType {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    email: string;
    role_id: string;
    job_title: string;
  };
}

interface Touched {
  memberFirstName: boolean;
  memberLastName: boolean;
  memberEmail: boolean;
  jobTitle: boolean;
  role: boolean;
  aboutYourself: boolean;
}

interface Error {
  memberFirstName: string;
  memberLastName: string;
  memberEmail: string;
  jobTitle: string;
  role: number;
  aboutYourself: string;
}

interface PaymentPlan {
  id: number;
  name: string;
  price: number;
  interval: string;
  stripe_plan_id: string;
  price_id: string | null;
  stripe_product_id: number;
  created_at: string;
  updated_at: string;
  discount_percentage: string;
}

export const configJSON = require('./config');

export interface Props {
  navigation: any;
  id: string;
  handleAddTeamMember: Function;
  getTeamMemberListApi: Function;
}

export interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  Name: string;
  Email: string;
  Profile: string;
  file: {
    uri: string | null;
    name: string | null;
    type: string | null;
  };
  profileImages: string;
  image: string | Blob;
  fullName: string;
  fullNameError: string;
  emailAddress: string;
  emailAddressError: string;
  profileImagesError: string;
  token: string | null;
  role: string;
  memberEmail: string;
  memberFirstName: string;
  memberLastName: string;
  jobTitle: string;
  aboutYourself: string;
  isMember: boolean;
  member: MemberType[];
  collapseOpen: boolean;
  isPayModalOpen: boolean;
  paymentPlans: PaymentPlan[];
  selectedPlan: number;
  teamId: string;
  isLoading: boolean;
  errorMessage: string;
  stripePlanID: string;
  isMemeberList: boolean;
}

interface SS {
  id: any;
}

export default class AddMemberController extends BlockComponent<
  Props,
  S,
  SS
> {
  getMembersListApiCallId: string = '';
  postCreateMemberCallId: string = '';
  createTeamApiCallId: string = '';
  deleteMemberCallId: string = '';
  getPaymentPlansApiCallId: string = '';
  postCreateSubscriptionPaymentCallId: string = '';
  stripe: any;

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
    ];
    this.state = {
      txtInputValue: '',
      txtSavedValue: 'A',
      enableField: false,
      Email: '',
      Name: '',
      Profile: '',
      file: { name: 'photo', uri: '', type: '' },
      fullName: '',
      fullNameError: '',
      emailAddress: '',
      emailAddressError: '',
      image: '',
      profileImages: '',
      profileImagesError: '',
      token: '',
      memberFirstName: '',
      memberLastName: '',
      memberEmail: '',
      jobTitle: '',
      aboutYourself: '',
      role: 'owner',
      isMember: true,
      member: [],
      collapseOpen: true,
      isPayModalOpen: false,
      paymentPlans: [],
      selectedPlan: 0,
      teamId: '',
      isLoading: false,
      errorMessage: '',
      stripePlanID: '',
      isMemeberList: false,
    };
    runEngine.attachBuildingBlock(
      this as IBlock,
      this.subScribedMessages
    );
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog('Message Recived', message);

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson.errors && responseJson.errors[0].message) {
        Alert.alert(responseJson.errors[0].message);
        this.setState({ isLoading: false });
        return;
      }

      if (apiRequestId === this.getMembersListApiCallId) {
        this.handleResponse(responseJson);
      }
      if (
        apiRequestId === this.postCreateMemberCallId ||
        apiRequestId === this.deleteMemberCallId
      ) {
        this.handleAddMemberResponse(responseJson);
      }
      if (apiRequestId === this.createTeamApiCallId) {
        this.handleCreateTeamResp(responseJson);
      }
      if (apiRequestId === this.getPaymentPlansApiCallId) {
        this.setState({ paymentPlans: responseJson });
      }
      if (apiRequestId === this.postCreateSubscriptionPaymentCallId) {
        this.handleSubscriptionPaymentResponse(responseJson);
      }
    }
  }

  makePaymentHandler = async (token: any) => {
    this.setState({ isLoading: true });
    const tokenId = await getStorageData('token');

    const header = {
      'Content-Type': configJSON.ContentType,
      token: tokenId,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.postCreateSubscriptionPaymentCallId =
      requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.subscriptionPaymentEndPoint}?plan_id=${this.state.stripePlanID}&stripe_token=${token.id}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleSubscriptionPaymentResponse = (responseJson: any) => {
    if (!responseJson.errors) {
      toast.success(responseJson.message);
      setTimeout(() => {
        const msg: Message = new Message(
          getName(MessageEnum.NavigationMessage)
        );
        msg.addData(
          getName(MessageEnum.NavigationPropsMessage),
          this.props
        );
        msg.addData(
          getName(MessageEnum.NavigationTargetMessage),
          'CustomisableUserProfiles'
        );
        this.send(msg);
      }, 2000);
    } else {
      toast.error('Payment Failed ! Try Again Later');
    }
  };

  handleAddMemberResponse = (responseJson: any) => {
    if (responseJson.error) {
      this.setState({
        isLoading: false,
        errorMessage: responseJson.error,
      });
    } else {
      this.getMembersListAPICall();
      this.setState({ isMemeberList: true });
    }
  };

  handleResponse = (responseJson: Response) => {
    this.setState({ member: responseJson.data, isLoading: false });
    if (this.state.isMember || !responseJson.data.length) {
      this.handleAddMember();
    }
  };

  handleCreateTeamResp = (responseJson: any) => {
    this.setState({ teamId: responseJson.data.id });
    this.createTeamMemberApiCall(responseJson.data.id);
  };

  selectProfile = () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (ImagePicker)
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        }).then((image) => {
          this.setState({
            file: {
              uri: image.path,
              name: 'photo',
              type: image.mime,
            },
            Profile: image.path,
          });
        });
    }
  };

  onChangeName = (value: string) => {
    this.setState({ Name: value });
  };

  onChangeEmail = (value: string) => {
    this.setState({ Email: value });
  };

  getMembersListAPICall = async () => {
    const token = await getStorageData('token');

    const header = {
      'Content-Type': 'application/json',
      token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getMembersListApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.teamEndPoint}/${this.state.teamId}/list_members`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  createTeamApiCall = async () => {
    this.setState({ isLoading: true });
    const token = await getStorageData('token');

    const header = {
      'Content-Type': 'application/json',
      token: token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.createTeamApiCallId = requestMessage.messageId;

    const httpBody = {
      data: {
        attributes: {
          team_name: `team_${Date.now()}`,
        },
      },
    };

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.teamEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  setInputValue = (text: string) => {
    this.setState({ fullName: text, fullNameError: '' });
  };
  handleEmail = (text: string) => {
    this.setState({ emailAddress: text, emailAddressError: '' });
  };

  handleAddMember = () => {
    this.setState((prevState) => ({
      ...prevState,
      isMember: !prevState.isMember,
      memberFirstName: '',
      memberEmail: '',
      memberLastName: '',
      jobTitle: '',
      aboutYourself: '',
      role: 'owner',
    }));
  };
  handleRoleClick = (value: string) => {
    this.setState({ role: value });
  };

  handleMemberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFieldValue: (
      field: string,
      value: any
    ) => Promise<void | FormikErrors<Error>>
  ) => {
    const { name, value } = e.target;

    this.setState({ [name]: value } as unknown as Pick<S, keyof S>);
    setFieldValue(name, value);
  };

  handleCollapseClick = () =>
    this.setState((prev) => ({ collapseOpen: !prev.collapseOpen }));

  handlePayModal = () =>
    this.setState((prev) => ({
      isPayModalOpen: !prev.isPayModalOpen,
      selectedPlan: 0,
    }));

  handleSelectedPlan = (planId: number, stripe_plan_id: string) => {
    this.setState({ selectedPlan: planId });
    this.setState({ stripePlanID: stripe_plan_id });
  };

  handlePayment = () => {
    this.setState({ isPayModalOpen: false });
  };

  handleSnackClose = () => this.setState({ errorMessage: '' });

  getErrorMessage = (
    touched: FormikTouched<Touched>,
    errors: FormikErrors<Error>,
    value: string
  ) =>
    touched[value as keyof Error] &&
    errors[value as keyof Error] && (
      <Typography
        style={{
          marginTop: '2px',
          fontSize: '14px',
          color: '#f94b4b',
        }}
      >
        {errors[value as keyof Error]}
      </Typography>
    );
  goToSubscription = () => {
    this.setState({ isPayModalOpen: true });
  };
  handleSubmit = () => {
    if (this.state.isMember) {
      if (this.state.teamId) {
        this.createTeamMemberApiCall(this.state.teamId);
      } else {
        this.createTeamApiCall();
      }
    } else {
      this.handleAddMember();
    }
  };

  createTeamMemberApiCall = async (id: string) => {
    this.setState({ isLoading: true });
    const token = await getStorageData('token');

    const header = {
      'Content-Type': configJSON.ContentType,
      token: token,
    };

    const httpBody = {
      membership: {
        first_name: this.state.memberFirstName,
        last_name: this.state.memberLastName,
        email: this.state.memberEmail,
        job_title: this.state.jobTitle,
        role_id: this.state.role,
        about_me: this.state.aboutYourself,
      },
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.postCreateMemberCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.teamEndPoint}/${id}/add_member`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPostMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  removeTeamMemberApiCall = async (id: string) => {
    this.setState({ isLoading: true });
    const token = await getStorageData('token');

    const header = {
      'Content-Type': configJSON.ContentType,
      token: token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.deleteMemberCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.teamEndPoint}/${this.state.teamId}/remove_member/${id}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.delete
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getPaymentPlansApiCall = async () => {
    const token = await getStorageData('token');

    const header = {
      'Content-Type': 'application/json',
      token,
    };

    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getPaymentPlansApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.paymentPlansEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  async componentDidMount() {
    if (Platform.OS === 'web') {
      this.setState({ token: localStorage.getItem('token') });
    }
    this.getPaymentPlansApiCall();
  }

  handleCondition = (Condition: any, True: any, False: any) => {
    return Condition ? True : False;
  };

  ternarHandler = (condition: boolean, option1: any, option2: any) =>
    condition ? option1 : option2;

  isAddMemberDisabled = () =>
    !this.state.memberFirstName ||
    !this.state.memberLastName ||
    !this.state.memberEmail ||
    !this.state.jobTitle ||
    !this.state.aboutYourself;
}

// Customizable Area End
