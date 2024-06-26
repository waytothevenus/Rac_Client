const CopyAddressButton = (props: any) => {
  const { address } = props;

  const copiedAddress = address.street + address.city + address.state + address.country + address.code

  const copyText = () => {
    navigator.clipboard.writeText(copiedAddress);
    document!.getElementById('copy-address')!.innerHTML = 'Address Copied';

    setTimeout(() => {
      document!.getElementById('copy-address')!.innerHTML = 'Copy Address';

    }, 3000);
  }

  return (
    <div className="flex bottom-[49px] right-[20px] md:bottom-[60px] md:right-[53px] justify-center">
      <button
        aria-label="Need Help?"
        onClick={e => copyText()}
        className="w-full btn btn-elevated relative flex flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white shadow-lg md:px-6"
      >
        <SupportIcon />
        <span className="md:block" id="copy-address">Copy Address</span>
      </button>
    </div>
  );
};

const SupportIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path d="M12.8359 9.675V12.825C12.8359 15.45 11.7859 16.5 9.16094 16.5H6.01094C3.38594 16.5 2.33594 15.45 2.33594 12.825V9.675C2.33594 7.05 3.38594 6 6.01094 6H9.16094C11.7859 6 12.8359 7.05 12.8359 9.675Z" fill="white" />
      <path d="M13.6613 1.5H10.5112C8.29882 1.5 7.21046 2.25121 6.92267 4.05369C6.83486 4.60363 7.29874 5.0625 7.85565 5.0625H9.16125C12.3113 5.0625 13.7738 6.525 13.7738 9.675V10.9806C13.7738 11.5375 14.2326 12.0014 14.7826 11.9136C16.585 11.6258 17.3363 10.5374 17.3363 8.325V5.175C17.3363 2.55 16.2863 1.5 13.6613 1.5Z" fill="white" />
    </svg>
  );
};

export default CopyAddressButton;
