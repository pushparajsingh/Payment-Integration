// Customizable Area Start
import React from "react";
import {
  Box,
  Button,
  Typography,
  styled,
  TextField,
  Collapse,
  Modal,
  Snackbar,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import * as Yup from "yup";

import { Logo, loginbg } from "./assets";
import AddMemberController, { Props } from "./AddMemberController";
import { Formik } from "formik";
import {
  Close,
  ControlPoint,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import Loader from "../../../components/src/Loader.web";
import { Alert } from "@material-ui/lab";
import { capitalLetterMethod } from "../../../components/src/utils";
import StripeCheckout from 'react-stripe-checkout';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
  typography: {
    body1: {
      fontFamily: "Poppins",
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #CBD5E1",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #CBD5E1",
        },
      },
    },
  },
});

const MainGrid = styled("div")({
  backgroundImage: `url(${loginbg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflowX: "auto",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  display: "flex",
  height: "100vh",
  marginBottom: "0px",
  zIndex: 99999999999,
  width: "100%",
  "@media(max-width:768px)": {
    flexDirection: "column",
    overflowX: "hidden",
  },
});

const LeftHalf = styled("div")({
  flex: 1,
  position: "relative",
});
const RightHalf = styled("div")({
  padding: "40px 48px 40px 48px",
  display: "flex",
  width: "42%",
  minHeight: "calc(100vh - 80px)",
  height: "fit-content",
  borderBottomLeftRadius: "24px",
  borderTopLeftRadius: "24px",
  backgroundColor: "white",
  "@media(max-width:768px)": {
    width: "calc(100vw - 96px)",
    marginTop: "100vh",
    height: "auto",
  },
});
const TeamMemberForm = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "90%",
  margin: "0 auto",
});

const InputGroup = styled("div")({
  marginBottom: "1rem",
  width: "100%",
});
const PlusGroup = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
});
const PlusGroupContainer = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const PlusText = styled("div")({
  color: "#237182",
  fontWeight: 700,
  fontSize: "18px",
});

const FirstAndLastNameInputGroup = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  marginTop: "32px",
});

const LogoContainer = styled("div")({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media(max-width:768px)": {
    transform: "translate(-50%, 0)",
  },
});
const LogoImage = styled("img")({
  paddingTop: "50px",
  maxWidth: "500px",
  width: "100%",
  height: "500px",
  paddingBottom: "50px",
});
const LogoTextTop = styled("div")({
  color: "#fff",
  fontSize: "30px",
  fontWeight: "bold",
  width: "100%",
  lineHeight: "40px",
});
const LogoTextBottom = styled("div")({
  textAlign: "center",
  fontWeight: 700,
  fontSize: "38px",
  color: "white",
  lineHeight: "1.2",
});

const LogoTextBottom1 = styled("div")({
  paddingTop: "16px",
  textAlign: "center",
  fontWeight: 400,
  fontSize: "18px",
  color: "white",
});

const MemberTextBottom = styled("div")({
  paddingTop: "8px",
  fontWeight: 400,
  fontSize: "16px",
  width: "100%",
  color: "#475569",
  lineHeight: "1.5rem",
});

const TextContainer = styled("div")({
  paddingLeft: "11px",
  paddingRight: "12px",
});
const Skip = styled("div")({
  color: "#237182",
  fontSize: "18px",
  fontWeight: 700,
  width: "100%",
  justifyContent: "end",
  display: "flex",
  cursor: "pointer",
});

const RoleDiv = styled("div")({
  backgroundColor: "#F8FAFC",
  borderRadius: "50px",
  width: "100%",
  display: "flex",
  padding: "4px",
  justifyContent: "space-between",
});

const MemberCard = styled("div")({
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderLeft: "2px solid #1E353B",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  marginBlock: "1rem",
  boxShadow: "0px 2px 8px 0px #00000014",
});
const MemberCardContainer = styled("div")({
  height: "68vh",
  width: "100%",
  marginTop: "28px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "@media(max-width:1245px)": {
    height: "60vh",
  },
});

const MembersCollapse = styled(Collapse)({
  overflowX: "hidden" as "hidden",
  overflowY: "auto" as "auto",
  maxHeight: "50vh",
  "@media(max-width:1245px)": {
    maxHeight: "40vh",
  },
});

const AddMemberContainer = styled("div")({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 0px",
  cursor: "pointer",
});
const MemberCardLeftData = styled("div")({
  width: "80%",
  padding: "16px 0px 16px 24px",
});
const MemberCardRightData = styled("div")({
  width: "20%",
  padding: "16px 24px 16px 0px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
const CardNameLabel = styled("div")({
  fontSize: "16px",
  fontWeight: 600,
  color: "#0F172A",
  paddingBottom: "6px",
  fontFamily: "Poppins",
});
const CardEmailLabel = styled("div")({
  fontSize: "12px",
  fontWeight: 400,
  color: "#475569",
  marginTop: "6px",
  fontFamily: "Poppins",
});
const RightSideLabel = styled("div")({
  color: "#325962",
  backgroundColor: "#E0EDF0",
  fontSize: "12px",
  fontWeight: 400,
  padding: "4px 8px",
  borderRadius: "16px",
  marginBottom: "0.75rem",
});
const RightSideRemoveLabel = styled("div")({
  color: "#DC2626",
  fontSize: "14px",
  fontWeight: 700,
  marginRight: "4px",
  cursor: "pointer",
});

const ModalBox = styled("div")({
  width: "50vw",
  padding: "1.5rem",
  background: "white",
  borderRadius: "8px",
  position: "absolute",
  top: "25%",
  left: "25%",
  "@media(max-width:768px)": {
    top: "15%",
  },
});

const PaymentOptions = styled("div")({
  display: "flex",
  justifyContent: "space-around",
  margin: "4.5rem 0 2.5rem",
  "@media(max-width:768px)": {
    flexDirection: "column",
    gap: "1.5rem",
  },
});

const PaymentItem = styled("div")({
  position: "relative",
  boxSizing: "border-box",
  width: "30%",
  padding: "2rem 1.5rem",
  textAlign: "center",
  border: "1px solid #CBD5E1",
  borderRadius: "12px",
  cursor: "pointer",
  "@media(max-width:768px)": {
    width: "100%",
  },
});

const PaymentButton = styled(Button)({
  margin: "0 1rem",
  padding: "1rem 0",
  width: "calc(100% - 2rem)",
  background: "#237182",
  borderRadius: "8px",
  color: "white",
  fontWeight: 700,
  lineHeight: "1.5rem",
  fontFamily: "Poppins",
  textTransform: "capitalize",
  "&:disabled": {
    background: "#F1F5F9",
    color: "#64748B",
    cursor: "auto",
  },
  "&:hover": {
    background: "#237182",
  },
  "@media(max-width:768px)": {
    width: "100%",
    margin: "0",
  },
});

const ErrorAlert = styled(Alert)({
  fontSize: "1rem",
});

const AddMemberButton = styled(Button)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "16px",
  backgroundColor: "#237182",
  borderRadius: "8px",
  padding: "16px",
  border: "none",
  width: "100%",
  textTransform: "capitalize",
  fontFamily: "Poppins",
  "&:disabled": {
    backgroundColor: "#F1F5F9",
    color: "#64748B",
  },
  "&:hover": {
    backgroundColor: "#237182",
  },
});

const webStyles = {
  finishTextStyle: {
    width: "240px",
  },
  RoleButton: {
    color: "#64748B",
    fontSize: "16px",
    fontWeight: 600,
    padding: "10px 12px 10px 12px",
    display: "flex",
    alignItems: "center",
    width: "33%",
    borderRadius: "50px",
    justifyContent: "center",
    textTransform: "capitalize",
    fontFamily: "Poppins"
  },
  RoleSelectedButton: {
    color: "#325962",
    backgroundColor: "#E0EDF0",
    fontSize: "16px",
    fontWeight: 600,
    border: "1px solid #D3E4E9",
    borderRadius: "50px",
    padding: "10px 12px 10px 12px",
    display: "flex",
    alignItems: "center",
    width: "33%",
    justifyContent: "center",
    textTransform: "capitalize",
    fontFamily: "Poppins"
  },
  expandIcon: {
    color: "#237182",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: "2rem",
  },
  closeIcon: {
    color: "#0F172A",
    cursor: "pointer",
  },
  selectedPlan: {
    border: "2px solid #237182",
  },
  paymentItemTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    lineHeight: "1.75rem",
    marginBottom: "1.5rem",
  },
  priceNumber: {
    fontSize: "1.875rem",
    fontWeight: 700,
    lineHeight: "2.5rem",
  },
  planType: {
    fontSize: "0.875rem",
  },
  discountLabel: {
    position: "absolute" as "absolute",
    display: "inline-block",
    backgroundColor: "#b3d4db",
    clipPath: "polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)",
    color: "white",
    textAlign: "center" as "center",
    padding: "8px",
    fontSize: "0.875rem",
    fontWeight: 700,
    fontFamily: "Poppins, sans-serif",
    right: "12px",
    top: 0,
  },
};
const inputStyles = {
  borderRadius: "8px",
};
const errorStyles = {
  marginLeft: 2,
};
const placeholderStyles = {
  fontFamily: "Poppins, sans-serif",
};

export default class AddNewTeamMember extends AddMemberController {
  constructor(props: Props) {
    super(props);
  }

  teamMemberSchema = () => {
    return Yup.object().shape({
      memberFirstName: Yup.string().required("First name is required!"),
      memberLastName: Yup.string().required("Last name is required!"),
      memberEmail: Yup.string()
        .email("Email is not valid")
        .required("Email is required!"),
      jobTitle: Yup.string().required("Job title is required!"),
      role: Yup.string().required("Role is required!"),
      aboutYourself: Yup.string().required("About yourself is required!"),
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <MainGrid data-test-id="memberContainer">
        <ToastContainer
          autoClose={5000}
          position="bottom-right"
          className="toast-container"
          toastClassName="dark-toast"
          style={{
            zIndex: 2000000
          }}
          newestOnTop
        />
          <LeftHalf>
            <LogoContainer>
              <LogoTextTop>Logo Here</LogoTextTop>
              <LogoImage src={Logo} alt="Logo" />
              <TextContainer>
                <LogoTextBottom>Invite your team</LogoTextBottom>
                <LogoTextBottom1>
                  Invite your team to collaborate on constructing superior
                  buildings together.
                </LogoTextBottom1>
              </TextContainer>
            </LogoContainer>
          </LeftHalf>
          <RightHalf>
            <TeamMemberForm data-test-id="loginForm">
              {this.state.isMember && !this.state.isMemeberList?<Skip onClick={this.goToSubscription}>Skip & Pay</Skip>:null}
              {this.state.isMemeberList && this.state.isMember?<Skip onClick={()=>this.setState({isMember:false})}>Cancel</Skip>:null}
              <div
                data-test-id="btnSocialLogin"
                style={{
                  fontWeight: 700,
                  width: "100%",
                  color: "black",
                  fontSize: "30px",
                  paddingTop: "32px",
                  paddingBottom: "8px",
                }}
              >
                Add users and team members
              </div>
              <MemberTextBottom>
                You can add members later also
              </MemberTextBottom>
              <MemberTextBottom>
                Please fill in details below and add members to your team
              </MemberTextBottom>

              {!this.state.isMember ? (
                <>
                  <MemberCardContainer>
                    <Box>
                      <AddMemberContainer onClick={this.handleCollapseClick}>
                        <PlusText>Added members</PlusText>
                        {this.handleCondition(
                          this.state.collapseOpen ,(
                            <ExpandLess style={webStyles.expandIcon} />
                          ) , (
                            <ExpandMore style={webStyles.expandIcon} />
                          )
                        )}
                      </AddMemberContainer>
                      <MembersCollapse
                        in={this.state.collapseOpen}
                        timeout="auto"
                        unmountOnExit
                      >
                        <div
                          style={{
                            height: "80%",
                          }}
                        >
                          {this.handleCondition(
                            this.state.member.length > 0 , this.state.member.map((mem, index) => (
                              <MemberCard key={index}>
                                <MemberCardLeftData>
                                  <CardNameLabel>
                                    {mem.attributes.first_name}{" "}
                                    {mem.attributes.last_name}
                                  </CardNameLabel>
                                  <CardEmailLabel>
                                    {mem.attributes.email}
                                  </CardEmailLabel>
                                  <CardEmailLabel>
                                    {mem.attributes.job_title}
                                  </CardEmailLabel>
                                </MemberCardLeftData>
                                <MemberCardRightData>
                                  <RightSideLabel>
                                    {capitalLetterMethod(mem.attributes.role_id)}
                                  </RightSideLabel>
                                  <RightSideRemoveLabel
                                    onClick={() =>
                                      this.removeTeamMemberApiCall(mem.id)
                                    }
                                    data-test-id={`remove_${index}`}
                                  >
                                    Remove
                                  </RightSideRemoveLabel>
                                </MemberCardRightData>
                              </MemberCard>
                            )),
                            <Box 
                            style={{fontWeight:400,fontSize:'14px',width:'100%',color:'#475569',textAlign:'center'}}>
                              No Members Added
                              </Box>
                          )}
                        </div>
                      </MembersCollapse>
                    </Box>
                    <PlusGroupContainer>
                      <PlusGroup onClick={(_) => this.handleAddMember()}>
                        <ControlPoint style={{ color: "#237182" }} />
                        <PlusText>Add Member</PlusText>
                      </PlusGroup>
                      <AddMemberButton
                        data-test-id="submitBtn"
                        variant="contained"
                        type="submit"
                        color="primary"
                        fullWidth
                        style={webStyles.finishTextStyle}
                        onClick={this.handlePayModal}
                      >
                        Finish & Pay
                      </AddMemberButton>
                    </PlusGroupContainer>
                  </MemberCardContainer>
                </>
              ) : (
                <Box style={{ width: "100%" }}>
                  <Formik
                    data-test-id="formik"
                    initialValues={{
                      memberFirstName: this.state.memberFirstName,
                      memberLastName: this.state.memberLastName,
                      memberEmail: this.state.memberEmail,
                      jobTitle: this.state.jobTitle,
                      role: this.state.role,
                      aboutYourself: this.state.aboutYourself,
                    }}
                    validationSchema={this.teamMemberSchema}
                    onSubmit={this.handleSubmit}
                  >
                    {({ errors, touched, setFieldValue, handleSubmit }) => (
                      <Box>
                        <FirstAndLastNameInputGroup>
                          <InputGroup>
                            <Box>
                              <Typography
                                style={{
                                  fontWeight: 600,
                                  color: "#334155",
                                  fontSize: "16px",
                                }}
                              >
                                First Name *
                              </Typography>
                              <TextField
                                placeholder="Enter first name"
                                size="medium"
                                variant="outlined"
                                data-test-id="txtInputFirstName"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={this.state.memberFirstName}
                                name="memberFirstName"
                                onChange={(e) => {
                                  this.handleMemberChange(e, setFieldValue);
                                }}
                                error={
                                  !!errors.memberFirstName &&
                                  touched.memberFirstName
                                }
                                InputProps={{
                                  style: inputStyles,
                                  inputProps: {
                                    style: placeholderStyles,
                                  },
                                }}
                                FormHelperTextProps={{ style: errorStyles }}
                              />
                              {this.getErrorMessage(
                                touched,
                                errors,
                                "memberFirstName"
                              )}
                            </Box>
                          </InputGroup>
                          <InputGroup>
                            <Box>
                              <Typography
                                style={{
                                  fontWeight: 600,
                                  color: "#334155",
                                  fontSize: "16px",
                                }}
                              >
                                Last Name *
                              </Typography>
                              <TextField
                                placeholder="Enter last name"
                                size="medium"
                                variant="outlined"
                                data-test-id="txtInputLastName"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={this.state.memberLastName}
                                name="memberLastName"
                                onChange={(e) => {
                                  this.handleMemberChange(e, setFieldValue);
                                }}
                                error={
                                  !!errors.memberLastName &&
                                  touched.memberLastName
                                }
                                InputProps={{
                                  style: inputStyles,
                                  inputProps: {
                                    style: placeholderStyles,
                                  },
                                }}
                                FormHelperTextProps={{ style: errorStyles }}
                              />
                              {this.getErrorMessage(
                                touched,
                                errors,
                                "memberLastName"
                              )}
                            </Box>
                          </InputGroup>
                        </FirstAndLastNameInputGroup>
                        <InputGroup>
                          <Box>
                            <Typography
                              style={{
                                fontWeight: 600,
                                color: "#334155",
                                fontSize: "16px",
                              }}
                            >
                              Email *
                            </Typography>
                            <TextField
                              placeholder="Enter email"
                              size="medium"
                              variant="outlined"
                              data-test-id="txtInputEmail"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              value={this.state.memberEmail}
                              name="memberEmail"
                              onChange={(e) => {
                                this.handleMemberChange(e, setFieldValue);
                              }}
                              error={
                                !!errors.memberEmail && touched.memberEmail
                              }
                              InputProps={{
                                style: inputStyles,
                                inputProps: {
                                  style: placeholderStyles,
                                },
                              }}
                              FormHelperTextProps={{ style: errorStyles }}
                            />
                            {this.getErrorMessage(
                              touched,
                              errors,
                              "memberEmail"
                            )}
                          </Box>
                        </InputGroup>
                        <InputGroup>
                          <Box>
                            <Typography
                              style={{
                                fontWeight: 600,
                                color: "#334155",
                                fontSize: "16px",
                              }}
                            >
                              Job Title *
                            </Typography>
                            <TextField
                              placeholder="Enter job title"
                              size="medium"
                              variant="outlined"
                              data-test-id="txtInputJobTitle"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              value={this.state.jobTitle}
                              name="jobTitle"
                              onChange={(e) => {
                                this.handleMemberChange(e, setFieldValue);
                              }}
                              error={!!errors.jobTitle && touched.jobTitle}
                              InputProps={{
                                style: inputStyles,
                                inputProps: {
                                  style: placeholderStyles,
                                },
                              }}
                              FormHelperTextProps={{ style: errorStyles }}
                            />
                            {this.getErrorMessage(touched, errors, "jobTitle")}
                          </Box>
                        </InputGroup>
                        <InputGroup>
                          <Typography
                            style={{
                              fontWeight: 600,
                              color: "#334155",
                              fontSize: "16px",
                            }}
                          >
                            Role *
                          </Typography>
                          <RoleDiv>
                            <Button
                              style={this.ternarHandler(
                                this.state.role === "owner",
                                webStyles.RoleSelectedButton,
                                webStyles.RoleButton
                              )}
                              data-test-id="owner-role"
                              onClick={() => {
                                this.handleRoleClick("owner");
                              }}
                            >
                              Owner
                            </Button>
                            <Button
                              style={this.ternarHandler(
                                this.state.role === "manager",
                                webStyles.RoleSelectedButton,
                                webStyles.RoleButton
                              )}
                              data-test-id="manager-role"
                              onClick={() => {
                                this.handleRoleClick("manager");
                              }}
                            >
                              Manager
                            </Button>
                            <Button
                              style={this.ternarHandler(
                                this.state.role === "employee",
                                webStyles.RoleSelectedButton,
                                webStyles.RoleButton
                              )}
                              data-test-id="employee-role"
                              onClick={() => {
                                this.handleRoleClick("employee");
                              }}
                            >
                              Employee
                            </Button>
                          </RoleDiv>
                        </InputGroup>
                        <InputGroup>
                          <Box>
                            <Typography
                              style={{
                                fontWeight: 600,
                                color: "#334155",
                                fontSize: "16px",
                              }}
                            >
                              About yourself *
                            </Typography>
                            <TextField
                              placeholder="Type something here..."
                              data-test-id="txtInputAboutYourself"
                              size="medium"
                              variant="outlined"
                              fullWidth
                              value={this.state.aboutYourself}
                              error={
                                !!errors.aboutYourself && touched.aboutYourself
                              }
                              name="aboutYourself"
                              multiline
                              minRows={2}
                              InputProps={{
                                style: inputStyles,
                                inputProps: {
                                  style: placeholderStyles,
                                },
                              }}
                              onChange={(e) => {
                                this.handleMemberChange(e, setFieldValue);
                              }}
                              FormHelperTextProps={{ style: errorStyles }}
                            />
                            {this.getErrorMessage(
                              touched,
                              errors,
                              "aboutYourself"
                            )}
                          </Box>
                        </InputGroup>
                        <PlusGroupContainer>
                          <AddMemberButton
                            data-test-id="submitBtn"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.handleSubmit}
                            disabled={this.isAddMemberDisabled()}
                          >
                            Add Member
                          </AddMemberButton>
                        </PlusGroupContainer>
                      </Box>
                    )}
                  </Formik>
                </Box>
              )}
            </TeamMemberForm>
          </RightHalf>
          <Modal open={this.state.isPayModalOpen} onClose={this.handlePayModal}>
            <ModalBox>
              <Box display="flex" justifyContent="space-between">
                <Typography style={webStyles.modalTitle}>
                  Choose Subscription Plan
                </Typography>
                <Close
                  onClick={this.handlePayModal}
                  style={webStyles.closeIcon}
                />
              </Box>
              <PaymentOptions>
                {this.state.paymentPlans.map((plan) => (
                  <PaymentItem
                  data-test-id={`paymentPlan_${plan.id}`}
                    onClick={() => this.handleSelectedPlan(plan.id , plan.stripe_plan_id)}    
                    style={this.ternarHandler(
                      this.state.selectedPlan === plan.id,
                      webStyles.selectedPlan,
                      {}
                    )}
                  >
                    <Typography style={webStyles.paymentItemTitle}>
                      {plan.name}
                    </Typography>
                    <Typography>
                      <span style={webStyles.priceNumber}>
                        ${Math.round(plan.price / 100)}
                      </span>{" "}
                      / {plan.interval}
                    </Typography>
                    <Typography style={webStyles.planType}>
                      Team Plan
                    </Typography>
                    {plan.discount_percentage ? (
                      <Box style={webStyles.discountLabel}>
                        {plan.discount_percentage}
                        <br />
                        OFF
                      </Box>
                    ) : null}
                  </PaymentItem>
                ))}
              </PaymentOptions>

              <StripeCheckout data-test-id='makePaymentHandler' stripeKey= "pk_test_51PGj5URqFKo1OdwPID3gcy7r8GwQDxkZGObn6IA94CuRIoiZUMoUDxRiBuMYQZlio9bhaVHioRTSPpekShPDOdFo00dBUuZLPy"
              token={this.makePaymentHandler}
              >
              <PaymentButton
                disabled={!this.state.selectedPlan}
                onClick={this.handlePayment}
                data-test-id="submitPayment"
              >
                Pay Now
              </PaymentButton>
          
              </StripeCheckout>
             
            </ModalBox>
          </Modal>
          <Snackbar
            open={!!this.state.errorMessage}
            autoHideDuration={5000}
            onClose={this.handleSnackClose}
          >
            <ErrorAlert severity="error">{this.state.errorMessage}</ErrorAlert>
          </Snackbar>
          {this.state.isLoading ? <Loader loading /> : null}
        </MainGrid>
      
      </ThemeProvider>
    );
  }
}

// Customizable Area End
