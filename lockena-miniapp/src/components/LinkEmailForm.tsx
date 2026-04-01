import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Header from "./Header";
import InputItem from "./InputItem";
import ListGroup from "./ListGroup";
import Page from "./Page";
import Button from "./Button";

const LinkEmailForm = ({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Введите корректный email");
      return;
    }

    setIsLoading(true);
    await onSubmit(email);
    setIsLoading(false);
  };

  return (
    <Page className="z-30 absolute top-0 left-0 w-full bg-[#efeff4] dark:bg-[#000000]">
      <Header
        title="Привязка почты"
        left={
          <button
            onClick={onBack}
            className="flex items-center text-[#4f46e5] dark:text-[#6366f1] -ml-1"
          >
            <ArrowLeft />
          </button>
        }
      />

      <div className="mt-6">
        <ListGroup title="ЭЛЕКТРОННАЯ ПОЧТА">
          <InputItem
            value={email}
            onChange={setEmail}
            placeholder="example@mail.com"
            type="email"
          />
        </ListGroup>

        <div className="px-4 mt-8">
          <Button
            onClick={handleSubmit}
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Отправить ссылку"
            )}
          </Button>
        </div>

        <div className="px-4 mt-4 text-center">
          <p className="text-[13px] text-[#8e8e93]">
            Мы отправим ссылку для подтверждения на указанный адрес.
          </p>
        </div>
      </div>
    </Page>
  );
};

export default LinkEmailForm;
