import {useState} from 'react';
import {Button, Result, Steps, Tooltip} from 'antd';
import {CheckCircleFilled} from '@ant-design/icons';
import CartList from "./CartList";
import {useDispatch, useSelector} from "react-redux";
import {decrement, getCartItemsCount, increment, remove} from "../../store/cart/slice.ts";
import {selectIsDeliveryValid} from "../../store/delivery/slice.ts";
import CartDelivery from "./CartDelivery";
import {useNavigate} from "react-router-dom";
import CartPayment from "./CartPayment";
import CartContact from "./CartContact";

const CartPage = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [contactSaved, setContactSaved] = useState(false);
    const [bypassPayment, setBypassPayment] = useState(false);
    const dispatch = useDispatch()
    const cartItemsCount = useSelector(getCartItemsCount);
    const isDeliveryValid = useSelector(selectIsDeliveryValid);

    const handleIncrement = (productId:string) => {
        dispatch(increment({ productId: productId }));
    }

    const handleDecrease = (productId:string) => {
        dispatch(decrement({ productId: productId }));
    }
    const handleRemove = (productId:string) => {
        dispatch(remove({ productId: productId }));
    }

    const steps = [
        {
            title: 'Pedido',
            content: <CartList onIncrease={handleIncrement} onDecrease={handleDecrease} onRemove =  {handleRemove} />,
            canProceed: cartItemsCount > 0,
            blockedMessage: 'Agregá al menos un producto para continuar.',
            nextLabel: 'Siguiente',
            showFooter: true,
        },
        {
            title: 'Entrega',
            content: <CartDelivery />,
            canProceed: isDeliveryValid,
            blockedMessage: 'Completá los datos de entrega para continuar.',
            nextLabel: 'Siguiente',
            showFooter: true,
        },
        {
            title: 'Pago',
            content: <CartPayment onBypassChange={setBypassPayment} />,
            canProceed: true,
            blockedMessage: '',
            nextLabel: bypassPayment ? 'Continuar sin pago' : 'Ya pagué / Continuar',
            showFooter: true,
        },
        {
            title: 'Contacto',
            content: (
                <CartContact
                    onCompleted={() => {
                        setContactSaved(true);
                        setCurrent((prev) => prev + 1);
                    }}
                />
            ),
            canProceed: contactSaved,
            blockedMessage: 'Completá tus datos de contacto para finalizar.',
            nextLabel: '',
            showFooter: false,
        },
        {
            title: 'Listo',
            content: (
                <Result
                    icon={<CheckCircleFilled style={{color: '#5ea18b'}} />}
                    status="success"
                    title="¡Tu pedido está en camino!"
                    subTitle="Te vamos a avisar por WhatsApp o email cuando esté listo para retirar."
                />
            ),
            canProceed: false,
            blockedMessage: '',
            nextLabel: '',
            showFooter: false,
        }
    ];

    const isLastStep = current === steps.length - 1;
    const activeStep = steps[current];

    const next = () => {
        if (!activeStep.canProceed) return;
        setCurrent(current + 1);
    };

    const prev = () => {
        if(current === 0){
            navigate("/")
            return;
        }
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <div style={{height: '100%', padding: '16px', paddingBottom: 96}}>
            <Steps current={current} items={items} size="small" responsive />
            <div style={{paddingTop: '24px'}}>{activeStep.content}</div>

            {activeStep.showFooter && !isLastStep && (
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '16px 0',
                        marginTop: 24,
                        background: '#fff',
                        borderTop: '1px solid #f0f0f0',
                    }}
                >
                    <div style={{display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto'}}>
                        <Button style={{flex: 1, height: 44}} onClick={prev}>
                            {current === 0 ? 'Volver' : 'Atrás'}
                        </Button>
                        <Tooltip title={activeStep.canProceed ? '' : activeStep.blockedMessage}>
                            <span style={{flex: 1}}>
                                <Button
                                    type="primary"
                                    block
                                    style={{height: 44}}
                                    disabled={!activeStep.canProceed}
                                    onClick={next}
                                >
                                    {activeStep.nextLabel}
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            )}

            {isLastStep && (
                <div style={{paddingTop: 24, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
                    <Button size="large" onClick={() => navigate('/orders')}>
                        Ver mis pedidos
                    </Button>
                    <Button type="primary" size="large" onClick={() => navigate('/')}>
                        Volver al inicio
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
