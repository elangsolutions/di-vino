import { createContext, useContext } from "react";
import { notification } from "antd";

export const NotificationContext = createContext({
    notifySuccess: (_message: string, _description?: string) => {},
    notifyError: (_message: string, _description?: string) => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const notifySuccess = (message: string, description?: string) => {
        notification.success({ message, description });
    };

    const notifyError = (message: string, description?: string) => {
        notification.error({ message, description });
    };

    return (
        <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);
