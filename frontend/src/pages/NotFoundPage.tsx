import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import StatusPageLayout from "../components/layout/StatusPageLayout";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    // 2. Sử dụng layout
    <StatusPageLayout
      icon="❓"
      title="404 - Page Not Found"
      message="Sorry, we couldn't find the page you were looking for."
    >
      {/* 3. Truyền nút bấm vào làm 'children' */}
      <Button onClick={handleGoBack} variant="secondary">
        Go Back
      </Button>
    </StatusPageLayout>
  );
}
