import { useEffect, useState } from "react";

const Delivery = ( props:any ) => {

    const { condition, setCondition } = props;
    const [ del, setDel ] = useState( 1 );
    const [ width, setWidth ] = useState( 1920 );

    useEffect( () => {
        setDel( condition );
    }, [ condition ] );

    useEffect( () => {
        setWidth( window.innerWidth );
    }, [ window.innerWidth ] );

    return (
        <div className="grid min-[850px]:grid-cols-3 gap-[30px] max-[850px]:flex-col">
            <div className={"flex flex-col px-[20px] py-[10px] border rounded-[20px] " + ( condition === 1 ? "border-[#DF5000]" : "border" ) }>
                <div className="flex gap-[10px] items-center">
                    <input type="radio" name="delivery" id="de1" onChange={e=>setCondition(1)} defaultChecked />
                    <label  className="text-[22px] leading-[28px] font-[400]" htmlFor="de1">
                        All Delivered
                    </label>
                </div>
                {
                    ( del === 1 || width > 850 ) &&
                    <label className="text-[16px] font-[400] leading-[24px] tracking-[.5px] mt-2 gap-[2px]" htmlFor="de1">
                    This status indicates that all items in your package, intended for shipment, have successfully arrived at the <span className="text-[#21005D]">RAC Logistics warehouse location</span> you choose to ship from.
                    </label>

                }
            </div>
            <div className={"flex flex-col px-[20px] py-[10px] border rounded-[20px] " + ( condition === 2 ? "border-[#21BCAA]" : "border" ) }>
                <div className="flex gap-[10px] items-center">
                    <input type="radio" name="delivery" id="de2" onChange={e=>setCondition(2)} />
                    <label  className="text-[22px] leading-[28px] font-[400]" htmlFor="de2">
                        Some Delivered
                    </label>
                </div>
                {
                    (del === 2 || width > 850) &&
                    <label className="text-[16px] font-[400] leading-[24px] tracking-[.5px] mt-2 gap-[2px]" htmlFor="de2">
                    This status indicates that a portion of the items in your package,  intended for shipment, has arrived at the <span className="text-[#21005D]">RAC Logistics warehouse location</span> you choose to ship from, but not all yet. They may still be in transit from the seller or the person that will drop them at the warehouse.
                    </label>
                }
            </div>
            <div className={"flex flex-col px-[20px] py-[10px] border rounded-[20px] " + ( condition === 3 ? "border-[#060C2C]" : "border" ) }>
                <div className="flex gap-[10px] items-center">
                    <input type="radio" name="delivery" id="de3" onChange={e=>setCondition(3)} />
                    <label  className="text-[22px] leading-[28px] font-[400]" htmlFor="de3">
                        None Delivered
                    </label>
                </div>
                {
                    (del === 3 || width > 850) &&
                    <label className="text-[16px] font-[400] leading-[24px] tracking-[.5px] mt-2 gap-[2px]" htmlFor="de3">
                    This status indicates that none of items in your package have successfully arrived at the <span className="text-[#21005D]">RAC Logistics warehouse location</span> you choose to ship from yet. They may still be in transit from the seller or the person that will drop them at the warehouse.
                    </label>
                }
            </div>
        </div>
    )
}

export default Delivery;