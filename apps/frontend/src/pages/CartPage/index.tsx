import React, {useState} from 'react';
import {Button, message, Steps, theme} from 'antd';
import CartList from "./CartList";
import {useDispatch, useSelector} from "react-redux";
import {decrement, getCartItemsCount, increment, remove} from "../../store/cart/slice.ts";
import CartDelivery from "./CartDelivery";
import {useNavigate} from "react-router-dom";
import CartPayment from "./CartPayment";


const App: React.FC = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const dispatch = useDispatch()
    const cartItemsCount  = useSelector(getCartItemsCount);

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
            title: 'Lista de pedidos',
            content: <CartList onIncrease={handleIncrement} onDecrease={handleDecrease} onRemove =  {handleRemove} />,
        },
        {
            title: 'Direccion de Entrega/PickUp',
            content: <CartDelivery />,
        },
        {
            title: 'Forma de Pago',
            content: <CartPayment amount={45000}/>,
        },
    ];


    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        if(current ===0){
            navigate("/")
        }
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };

    return (
        <>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div style={{ marginTop: 24 }}>
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Atras
                    </Button>
                )}
                {current === 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Volver
                    </Button>
                )}
                {current < steps.length - 1 && cartItemsCount > 0 && (
                    <Button type="primary" onClick={() => next()}>
                        Siguiente
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Comprar
                    </Button>
                )}
            </div>
        </>
    );
};

export default App;