import { useCallback, useEffect, useState } from "react";
import type { RequestState } from "../../api/dto/request-state.dto";
import { vaultService } from "../../api/services/vaultService";
import type { PaginationValues } from "../password/Pagination";
import type { GetVaultItemsDto } from "../../api/dto/vault-item/get-vault-items.dto";
import type { ParamsHeaderValues } from "../password/ParamsHeader";
import type { PasswordDto } from "../../api/dto/vault-item/password.dto";
import Pagination from "../password/Pagination";
import Card from "../password/Card";
import { Plus, SearchAlert } from "lucide-react";
import Loading from "../ui/Loading";
import ParamsHeader from "../password/ParamsHeader";
import Button from "../ui/Button";
import Table from "../password/Table";
import { useModal } from "../../hooks/useModal";
import useAuthStore from "../../store/authStore";
import { encryptVaultItem } from "../../crypto/vaultItem";
import PasswordModal from "../modals/PasswordModal";
import DeleteModal from "../modals/DeleteModal";

interface PasswordsPageProps {
  category: string;
  onChangeCategories: (categories: string[]) => void;
}

function PasswordsPage({ category, onChangeCategories }: PasswordsPageProps) {
  const [passwords, setPasswords] = useState<
    RequestState<GetVaultItemsDto<PasswordDto>>
  >({ state: "loading" });
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordDto[]>([]);
  const [pagination, setPagination] = useState<PaginationValues>({
    page: 1,
    pageSize: 8,
    total: 0,
  });
  const [filterParams, setFilterParams] = useState<ParamsHeaderValues>({
    search: "",
    sortDirection: "Asc",
    sortField: "name",
    viewMode: "grid",
  });
  const { showModal, hideModal } = useModal();
  const masterKey = useAuthStore((s) => s.masterKey);

  const fetchPasswords = useCallback(async () => {
    setPasswords({ state: "loading" });
    const result = await vaultService.getVaultItems({
      page: 1,
      pageSize: 100,
    });
    setPasswords(result);
  }, []);

  useEffect(() => {
    (async function () {
      fetchPasswords();
    })();
  }, [fetchPasswords]);

  const addPassword = useCallback(
    async (password: PasswordDto) => {
      if (!masterKey) return;
      const dto = await encryptVaultItem(masterKey, password);
      const result = await vaultService.createVaultItem(dto);
      if (result.state === "success" && passwords.state === "success") {
        const filter = [...passwords.data.items];
        filter.push({
          id: result.data.id,
          ...password,
          updatedAtUtc: result.data.updatedAtUtc,
        });
        setPasswords((prev) => ({
          ...prev,
          data: {
            items: filter,
            page: 1,
            pageSize: 100,
            total: filter.length,
          },
        }));
        hideModal();
      }
    },
    [masterKey, passwords, hideModal],
  );

  const editPassword = useCallback(
    async (id: string, password: PasswordDto) => {
      if (!masterKey) return;
      const dto = await encryptVaultItem(masterKey, password);
      const result = await vaultService.updateVaultItem(id, dto);
      if (result.state === "success" && passwords.state === "success") {
        const filter = passwords.data.items.filter((p) => p.id !== id);
        filter.push({
          id: result.data.id,
          ...password,
          updatedAtUtc: result.data.updatedAtUtc,
        });
        setPasswords((prev) => ({
          ...prev,
          data: {
            items: filter,
            page: 1,
            pageSize: 100,
            total: filter.length,
          },
        }));
        hideModal();
      }
    },
    [hideModal, masterKey, passwords],
  );

  const deletePassword = useCallback(
    async (id: string) => {
      const result = await vaultService.deleteVaultItem(id);
      if (result.state === "success" && passwords.state === "success") {
        const filter = passwords.data.items.filter((p) => p.id !== id);
        setPasswords((prev) => ({
          ...prev,
          data: {
            items: filter,
            page: 1,
            pageSize: 100,
            total: filter.length,
          },
        }));
      }
    },
    [passwords],
  );

  const handleOpenPasswordModal = useCallback(
    (passwordEdit?: PasswordDto) => {
      showModal(
        <PasswordModal
          title={passwordEdit ? "Редактировать пароль" : "Добавить пароль"}
          onClose={() => {
            hideModal();
          }}
          onSave={(password: PasswordDto) => {
            if (!passwordEdit) addPassword(password);
            if (passwordEdit)
              editPassword(password.id ?? passwordEdit.id ?? "", password);
          }}
          initialPassword={passwordEdit || undefined}
        />,
      );
    },
    [addPassword, editPassword, hideModal, showModal],
  );

  const handleOpenDeleteModal = useCallback(
    (password: PasswordDto) => {
      showModal(
        <DeleteModal
          title="Удалить пароль"
          text="Вы уверены, что хотите удалить этот пароль?"
          onClose={() => {
            hideModal();
          }}
          onDelete={() => {
            if (password.id) deletePassword(password.id);
            hideModal();
          }}
        />,
      );
    },
    [deletePassword, hideModal, showModal],
  );

  useEffect(() => {
    if (passwords.state !== "success") return;
    const delay = filterParams.search ? 300 : 0;

    const handler = setTimeout(() => {
      let filtered = [...passwords.data.items];
      if (filterParams.search) {
        filtered = filtered.filter((v) =>
          v.serviceName
            .toLowerCase()
            .replaceAll(" ", "")
            .includes(filterParams.search.toLowerCase().replaceAll(" ", "")),
        );
      }

      switch (filterParams.sortField) {
        case "name":
          if (filterParams.sortDirection === "Asc")
            filtered.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
          else
            filtered.sort((a, b) => b.serviceName.localeCompare(a.serviceName));
          break;

        case "updated":
          if (filterParams.sortDirection === "Asc") {
            filtered.sort((a, b) => {
              if (!a.updatedAtUtc && !b.updatedAtUtc) return 0;
              if (!a.updatedAtUtc) return 1;
              if (!b.updatedAtUtc) return -1;
              return a.updatedAtUtc.localeCompare(b.updatedAtUtc);
            });
          } else {
            filtered.sort((a, b) => {
              if (!a.updatedAtUtc && !b.updatedAtUtc) return 0;
              if (!a.updatedAtUtc) return -1;
              if (!b.updatedAtUtc) return 1;
              return b.updatedAtUtc.localeCompare(a.updatedAtUtc);
            });
          }
          break;
      }
      if (category !== "Все пароли")
        filtered = filtered.filter((p) => p.category === category);
      setFilteredPasswords(filtered);
      setPagination((prev) => ({ ...prev, page: 1, total: filtered.length }));
    }, delay);

    return () => clearTimeout(handler);
  }, [category, passwords, filterParams]);

  useEffect(() => {
    const loadCategories = async () => {
      if (passwords.state !== "success") return;
      const cats = Array.from(
        new Set(passwords.data.items.map((p) => p.category)),
      ).sort();
      cats.unshift("Все пароли");
      onChangeCategories(cats);
    };
    loadCategories();
  }, [onChangeCategories, passwords]);

  const loadPage = useCallback((): PasswordDto[] => {
    const lastItemIndex = pagination.page * pagination.pageSize;
    const firstItemIndex = lastItemIndex - pagination.pageSize;
    const pageItems = filteredPasswords.slice(firstItemIndex, lastItemIndex);
    return pageItems;
  }, [filteredPasswords, pagination]);

  return (
    <>
      {passwords.state === "success" && passwords.data.items.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-1/3 p-6">
            <p className="text-gray-900 dark:text-white text-xl font-medium">
              Добро пожаловать!
            </p>
            <br />
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              У вас ещё нет ни одного сохранённого пароля. <br />
              Нажмите кнопку ниже, чтобы добавить свой первый пароль.
            </p>
            <Button
              title="Добавить пароль"
              onClick={() => {
                handleOpenPasswordModal();
              }}
              icon={<Plus />}
            />
          </div>
        </div>
      ) : (
        <>
          <ParamsHeader
            onAdd={() => {
              handleOpenPasswordModal();
            }}
            values={filterParams}
            onChange={setFilterParams}
          />
          {passwords.state === "loading" && (
            <Loading title="Загрузка паролей..." />
          )}
          {passwords.state === "success" &&
            filteredPasswords &&
            filteredPasswords.length === 0 &&
            filterParams.search && (
              <div className="flex flex-col flex-1">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 flex-1">
                  <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                    <SearchAlert className="w-20 h-20 text-gray-600 dark:text-gray-300" />
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      {filterParams.search !== ""
                        ? `Данные по запросу "${filterParams.search}" не найдены!`
                        : "В данной категории нет паролей"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          {passwords.state === "success" &&
            filteredPasswords &&
            filteredPasswords?.length !== 0 && (
              <>
                <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-1 sm:py-4 bg-gray-50 dark:bg-gray-900">
                  {filterParams.viewMode === "table" ? (
                    <Table
                      passwords={loadPage()}
                      onDelete={(password) => {
                        handleOpenDeleteModal(password);
                      }}
                      onEdit={(password) => {
                        if (password) handleOpenPasswordModal(password);
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 ">
                      {loadPage().map((password) => {
                        return (
                          <Card
                            key={password.id}
                            password={password}
                            onDelete={() => {
                              handleOpenDeleteModal(password);
                            }}
                            onEdit={() => {
                              if (password) handleOpenPasswordModal(password);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <Pagination pagination={pagination} onChange={setPagination} />
              </>
            )}
        </>
      )}
    </>
  );
}
export default PasswordsPage;
