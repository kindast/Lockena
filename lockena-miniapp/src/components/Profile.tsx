import { ChevronLeft, Key, User } from "lucide-react";
import ListGroup from "./ListGroup";
import Page from "./Page";
import Header from "./Header";
import { useEffect, useState } from "react";

const Profile = ({
  onBack,
  count,
  onClear,
}: {
  onBack: () => void;
  count: number;
  onClear: () => void;
}) => {
  const [fullname, setFullname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  useEffect(() => {
    const loadUserData = () => {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tg = window.Telegram.WebApp.initDataUnsafe.user;
        setFullname(`${tg.first_name ?? ""} ${tg.last_name ?? ""}`.trim());
        setUsername(tg.username ?? "Telegram User");
        setPhotoUrl(tg.photo_url ?? "");
      }
    };

    loadUserData();
  }, []);
  return (
    <Page className="z-20 absolute top-0 left-0 w-full">
      <Header
        title="Профиль"
        left={
          <button
            onClick={onBack}
            className="flex items-center text-[#6366f1] -ml-1"
          >
            <ChevronLeft size={24} />
            <span className="text-[17px]">Назад</span>
          </button>
        }
      />

      <div className="flex flex-col items-center py-10">
        <div className="w-24 h-24 rounded-full bg-[#efeff4] dark:bg-[#2c2c2e] flex items-center justify-center mb-4 border border-[#c6c6c8] dark:border-[#38383a]">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <User size={48} className="text-[#8e8e93]" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {fullname ?? "Мой аккаунт"}
        </h2>
        <p className="text-[#8e8e93]">@{username ?? "Telegram User"}</p>
      </div>

      <ListGroup>
        <div className="pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center justify-between border-b border-[#c6c6c8] dark:border-[#38383a]">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center mr-3">
              <Key size={18} className="text-white" />
            </div>
            <span className="text-[17px] text-black dark:text-white">
              Всего паролей
            </span>
          </div>
          <span className="text-[17px] text-[#8e8e93]">{count}</span>
        </div>
      </ListGroup>

      <ListGroup>
        <button
          onClick={onClear}
          className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] active:bg-[#e5e5ea]  dark:active:bg-[#2c2c2e] transition-colors flex items-center"
        >
          <span className="text-[17px] text-[#ff453a]">Стереть все данные</span>
        </button>
      </ListGroup>

      <div className="text-center mt-10 text-[#545458] text-[13px]">
        <p>Password Manager v1.0.0</p>
      </div>
    </Page>
  );
};

export default Profile;
