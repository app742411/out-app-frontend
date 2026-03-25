import ForgetPasswordForm from "../../components/auth/ForgetPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";


export default function ForgetPassword() {
  return (
    <>
      <PageMeta
        title="Forget Password | Out Academy"
    
      />
      <AuthLayout>
        <ForgetPasswordForm />
      </AuthLayout>
    </>
  );
}
