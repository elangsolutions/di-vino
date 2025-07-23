import {CardPayment as MPCardPayment, initMercadoPago} from '@mercadopago/sdk-react';


initMercadoPago('TEST-e7ecd3a3-887f-40dc-9daa-11f2d837947a', {locale: "es-AR"});


const CartPayment = ({amount}: any) => {

    const initialization = {
        amount: 100,
        preferenceId: "<PREFERENCE_ID>",
    };
    const customization = {
        paymentMethods: {
            ticket: "all",
            creditCard: "all",
            prepaidCard: "all",
            debitCard: "all",
            mercadoPago: "all",
        },
    };

    const onSubmit = async (
        {selectedPaymentMethod, formData}
    ) => {
        // callback called when clicking the submit data button
        return new Promise((resolve, reject) => {
            fetch("/process_payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((response) => {
                    // receive payment result
                    resolve();
                })
                .catch((error) => {
                    // handle error response when trying to create payment
                    reject();
                });
        });
    };
    const onReady = async () => {
        /*
          Callback called when Brick is ready.
          Here you can hide loadings from your site, for example.
        */
    };
    const onError = async (error) => {
        // callback llamado para todos los casos de error de Brick
        console.log(error);
    };

    return <div style={{width: "550px"}}>
        <MPCardPayment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
        />
    </div>
}

export default CartPayment;