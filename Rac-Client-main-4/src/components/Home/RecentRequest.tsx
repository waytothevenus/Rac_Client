const RecentRequest = (props: any) => {

    const { requestShow, setRequestShow } = props;

    return (
        <>
            <div className="flex gap-[20px]">
                <h2 className="font-bold text-gray-700 text-base">My Recent Order Requests</h2>
            </div>
            <form className="grid min-[560px]:grid-cols-4 max-[560px]:grid-cols-2 gap-[19px]">
                <label className="text-[16px] text-[#79747E] tracking-[.15px]" htmlFor="order1">
                    <div className="flex rounded-[20px] border items-center gap-[4px] py-[6px] px-[10px] max-[450px]:px-[5px]">
                        <input type="radio" className="flex w-[24px] h-[24px]" name="order" id="order1" defaultChecked onChange={e => setRequestShow('shop')} />
                        Shop for me
                    </div>
                </label>

                <label className="text-[16px] text-[#79747E] tracking-[.15px]" htmlFor="order2">
                    <div className="flex rounded-[20px] border items-center gap-[4px] py-[6px] px-[10px] max-[450px]:px-[5px]">
                        <input type="radio" className="flex w-[24px] h-[24px]" name="order" id="order2" onChange={e => setRequestShow('export')} />
                        Export
                    </div>
                </label>

                <label className="text-[16px] text-[#79747E] tracking-[.15px]" htmlFor="order3">
                    <div className="flex rounded-[20px] border items-center gap-[4px] py-[6px] px-[10px] max-[450px]:px-[5px]">
                        <input type="radio" className="flex w-[24px] h-[24px]" name="order" id="order3" onChange={e => setRequestShow('import')} />
                        Import
                    </div>
                </label>

                <label className="text-[16px] text-[#79747E] tracking-[.15px]" htmlFor="order4">
                    <div className="flex rounded-[20px] border items-center gap-[4px] py-[6px] px-[10px] max-[450px]:px-[5px]">
                        <input type="radio" className="flex w-[24px] h-[24px]" name="order" id="order4" onChange={e => setRequestShow('autoImport')} />
                        Auto import
                    </div>
                </label>
            </form>
        </>
    )
}

export default RecentRequest;