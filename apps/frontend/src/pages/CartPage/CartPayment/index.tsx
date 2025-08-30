//import {CardPayment as MPCardPayment, initMercadoPago} from '@mercadopago/sdk-react';
//initMercadoPago('TEST-e7ecd3a3-887f-40dc-9daa-11f2d837947a', {locale: "es-AR"});

const CartPayment = ({amount}: any) => {

    const initialization = {
        amount: amount,
    };

    const customization = {
        visual: {
            style: {
                theme: 'dark',
                variables: {
                    '--base-color': '#1E88E5',
                    '--form-background-color': '#f0f0f0',
                    '--input-background-color': '#ffffff',
                    '--text-primary-color': '#111111',
                    '--border-radius-medium': '12px',
                    '--height':  '500px',
                },
            },

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

    return <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '2rem',
            maxWidth: '500px',
            height: '500px',
            margin: '0 auto',
        }}
    >
        {/*<MPCardPayment*/}
        {/*    initialization={initialization}*/}
        {/*    customization={customization}*/}
        {/*    onSubmit={onSubmit}*/}
        {/*    onReady={onReady}*/}
        {/*    onError={onError}*/}
        {/*/>*/}
    </div>
}

export default CartPayment;