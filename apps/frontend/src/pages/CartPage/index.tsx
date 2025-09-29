import {FC, useState} from 'react';
import {Button, message, Steps} from 'antd';
import CartList from "./CartList";
import {useDispatch, useSelector} from "react-redux";
import {decrement, getCartItemsCount, increment, remove} from "../../store/cart/slice.ts";
import CartDelivery from "./CartDelivery";
import {useNavigate} from "react-router-dom";
import CartPayment from "./CartPayment";

const CartPage = () => {
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
            title: 'Resumen-confirmacion',
            content: <CartPayment />,
        },
        {
            title: 'En Proceso',
                content: 'Su pedido está en Camino'
        }
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

    return (
        <div style={{height: '100%', padding:'20px'}}>
            <Steps current={current} items={items} />
            <div style={{paddingTop:'30px'}}>{steps[current].content}</div>
            <div style={{ paddingTop: '20px' }}>
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
        </div>
    );
};

export default CartPage;