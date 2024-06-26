import { ArrowLeft } from "iconsax-react";
import Link from "next/link";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useAuthContext } from "~/contexts/AuthContext";
import FormHeader from "../FormHeader";
import TextInput from "../Inputs/TextInput";
import { VerifyButton } from "./TwoFactorAuthentication";

type Inputs = {
  backupCode: string;
};

const EnterBackupCode = () => {
  const { isAuthenticating, isFetchingUser, handleBackupCode } =
    useAuthContext();
  const formMethods = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    handleBackupCode(data.backupCode);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="mb-[30px] mt-[100px] flex w-full max-w-[600px] flex-col items-center justify-center gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]"
      >
        <FormHeader
          title={
            <div className="flex items-center gap-[20px]">
              <Link href="/login">
                <ArrowLeft color="#292D32" />
              </Link>
              <span>Enter your backup code</span>
            </div>
          }
          subTitle="Enter a 6-digit code from your back up codes that you have not used before to finish the login procedure"
        />

        <div className="flex w-full flex-col gap-[30px]">
          <TextInput
            id="backupCode"
            label="Enter Backup Code"
            maxLength={6}
            minLength={6}
            pattern="[0-9]{1,6}"
            disabled={isAuthenticating || isFetchingUser}
            {...formMethods.register("backupCode")}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <VerifyButton
            disabled={false}
            onClick={formMethods.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default EnterBackupCode;
