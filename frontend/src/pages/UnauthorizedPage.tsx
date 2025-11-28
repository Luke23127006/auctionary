import StatusPageLayout from "../layouts/StatusPageLayout";

export default function UnauthorizedPage() {
  return (
    <StatusPageLayout
      icon="🚫"
      title="Access Denied"
      message="You do not have permission to access this page."
    />
  );
}
