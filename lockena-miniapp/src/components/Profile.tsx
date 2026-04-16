import {
  ArrowLeft,
  FileDown,
  Key,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import ListGroup from "./ListGroup";
import Page from "./Page";
import Header from "./Header";
import { useEffect, useState } from "react";
import { userService, type ProfileDto } from "lockena-core";

const Profile = ({
  onBack,
  count,
  onClear,
  onExport,
  onLinkEmail,
  onChangePassword,
}: {
  onBack: () => void;
  count: number;
  onClear: () => void;
  onExport: () => void;
  onLinkEmail?: () => void;
  onChangePassword?: () => void;
}) => {
  const [fullname, setFullname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [profile, setProfile] = useState<ProfileDto>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const tg = window.Telegram.WebApp.initDataUnsafe.user;
        setFullname(`${tg.first_name ?? ""} ${tg.last_name ?? ""}`.trim());
        setUsername(tg.username ?? "Telegram User");
        setPhotoUrl(tg.photo_url ?? "");
      }
      try {
        const response = await userService.getProfile();
        if (response.state === "success") {
          setProfile(response.data);
        }
      } finally {
        setIsLoadingProfile(false);
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
            <ArrowLeft />
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
        <div className="border-b border-[#c6c6c8] dark:border-[#38383a] pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center justify-between">
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
        {isLoadingProfile || profile === undefined ? (
          <div className="w-full pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center">
            <div className="w-8 h-8 rounded-lg bg-[#e5e5ea] dark:bg-[#38383a] animate-pulse mr-3 shrink-0" />
            <div className="h-5 w-32 bg-[#e5e5ea] dark:bg-[#38383a] animate-pulse rounded" />
          </div>
        ) : profile?.email && !profile?.email.includes("@telegram") ? (
          <div className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center mr-3 shrink-0">
                <Mail size={18} className="text-white" />
              </div>
              <span className="text-[17px] text-black dark:text-white truncate">
                {profile.email}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onLinkEmail}
            className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] active:bg-[#e5e5ea] cursor-pointer dark:active:bg-[#2c2c2e] transition-colors flex items-center"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center mr-3 shrink-0">
                <Mail size={18} className="text-white" />
              </div>
              <span className="text-[17px] text-black dark:text-white">
                Привязать почту
              </span>
            </div>
          </button>
        )}
      </ListGroup>

      <ListGroup>
        <div className="border-b border-[#c6c6c8] dark:border-[#38383a]">
          <button
            onClick={onChangePassword}
            className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] active:bg-[#e5e5ea] cursor-pointer dark:active:bg-[#2c2c2e] transition-colors flex items-center"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] flex items-center justify-center mr-3">
                <Shield size={18} className="text-white" />
              </div>
              <span className="text-[17px] text-black dark:text-white">
                Сменить мастер-пароль
              </span>
            </div>
          </button>
        </div>
        <div className="border-b border-b-[#c6c6c8] dark:border-[#38383a]">
          <button
            onClick={onExport}
            className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] active:bg-[#e5e5ea] cursor-pointer dark:active:bg-[#2c2c2e] transition-colors flex items-center"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#33c15b] flex items-center justify-center mr-3">
                <FileDown size={18} className="text-white" />
              </div>

              <span className="text-[17px] ">Экспортировать данные</span>
            </div>
          </button>
        </div>
        <button
          onClick={onClear}
          className="w-full text-left pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] active:bg-[#e5e5ea] cursor-pointer dark:active:bg-[#2c2c2e] transition-colors flex items-center"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-[#ff453a] flex items-center justify-center mr-3">
              <Trash2 size={18} className="text-white" />
            </div>

            <span className="text-[17px] text-[#ff453a]">
              Стереть все данные
            </span>
          </div>
        </button>
      </ListGroup>

      <div className="text-center mt-10 text-[#545458] text-[13px]">
        <p>Lockena v1.0.0</p>
        <p>© 2026 Lockena. Все права защищены.</p>
      </div>
    </Page>
  );
};

export default Profile;
