const Countries = ( props: any ) => {
    const { setCountry } = props;

    return (
        <form className="flex flex-wrap gap-[30px] pb-5">
            <div className="flex min-w-[421px] items-center gap-[10px] border p-[20px] rounded-[20px]">
                <input type="radio" name="country" id="Nigeria" defaultChecked onChange={e => setCountry( 'Nigeria' )} />
                <label className="font-[400] text-[22px] text-[#49454F] leading-[28px]" htmlFor="Nigeria">Nigeria</label>
            </div>
            <div className="flex min-w-[583px] items-center gap-[10px] border p-[20px] rounded-[20px]">
                <input type="radio" name="country" id="US" onChange={e => setCountry( 'US' )}/>
                <label className="font-[400] text-[22px] text-[#49454F] leading-[28px]" htmlFor="US">The United States</label>
            </div>
            <div className="flex min-w-[369px] items-center gap-[10px] border p-[20px] rounded-[20px]">
                <input type="radio" name="country" id="UK" onChange={e => setCountry( 'UK' )}/>
                <label className="font-[400] text-[22px] text-[#49454F] leading-[28px]" htmlFor="UK">The United Kingdom</label>
            </div>
            <div className="flex min-w-[300px] items-center gap-[10px] border p-[20px] rounded-[20px]">
                <input type="radio" name="country" id="China" onChange={e => setCountry( 'China' )}/>
                <label className="font-[400] text-[22px] text-[#49454F] leading-[28px]" htmlFor="China">China</label>
            </div>
            <div className="flex min-w-[305px] items-center gap-[10px] border p-[20px] rounded-[20px]">
                <input type="radio" name="country" id="Dubai" onChange={e => setCountry( 'Dubai' )}/>
                <label className="font-[400] text-[22px] text-[#49454F] leading-[28px]" htmlFor="Dubai">Dubai</label>
            </div>
        </form>
    )
}

export default Countries;