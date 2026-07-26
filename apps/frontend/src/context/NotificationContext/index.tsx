import { createContext, useContext } from "react";
import { App } from "antd";

type NotifyFn = (message: string, description?: string) => void;

export const NotificationContext = createContext<{
    notifySuccess: NotifyFn;
    notifyError: NotifyFn;
}>({
    notifySuccess: () => {},
    notifyError: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { notification } = App.useApp();

    const notifySuccess: NotifyFn = (message, description) => {
        notification.success({ message, description, placement: "topRight" });
    };

    const notifyError: NotifyFn = (message, description) => {
        notification.error({ message, description, placement: "topRight" });
    };

    return (
        <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);
