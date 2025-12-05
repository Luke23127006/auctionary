// src/components/common/Can.jsx
import { usePermission } from "../../hooks/usePermission";

const Can = ({ I, children }: { I: string; children: React.ReactNode }) => {
  const { hasPermission } = usePermission();

  if (hasPermission(I)) {
    return <>{children}</>;
  }

  return null;
};

export default Can;
