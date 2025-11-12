import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import StatusPageLayout from "../components/common/StatusPageLayout";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/");

  return (
    // 2. Sử dụng layout
    <StatusPageLayout
      icon="🚫"
      title="Access Denied"
      message="You do not have permission to access this page."
    >
      <Button onClick={handleGoBack} variant="secondary">
        Go Back
      </Button>
    </StatusPageLayout>
  );
}
