import { useContext } from "react";
import { UserContext } from "../../../store/UserContext";
import { ConfirmationPage } from "../../../pages/Confirmation";

export const UserCheck = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user?.data?.access_data.access) {
    return (
      <ConfirmationPage
        header={user?.data?.access_data.access_header}
        text={user?.data?.access_data.access_text}
      />
    );
  }

  return children;
};
