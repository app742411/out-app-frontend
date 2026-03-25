
import OTPVerificationForm from "../../components/auth/OTPVerifactionForm";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";


export default function UpdatePassword() {
  return (
    <>
      <PageMeta
        title=" OTP Verification |Out SignIn Dashboard "
    
      />
      <AuthLayout>
        <UpdatePasswordForm />
      </AuthLayout>
    </>
  );
}
