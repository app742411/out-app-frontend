
import OTPVerificationForm from "../../components/auth/OTPVerifactionForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";


export default function OTPVerification() {
  return (
    <>
      <PageMeta
        title=" OTP Verification |Out SignIn Dashboard "
    
      />
      <AuthLayout>
        <OTPVerificationForm />
      </AuthLayout>
    </>
  );
}
