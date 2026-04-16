import { useCallback, useEffect, useState } from "react";
import type { PaginationValues } from "../password/Pagination";
import type { ParamsHeaderValues } from "../password/ParamsHeader";
import Pagination from "../password/Pagination";
import Card from "../password/Card";
import { Plus, SearchAlert } from "lucide-react";
import Loading from "../ui/Loading";
import ParamsHeader from "../password/ParamsHeader";
import Button from "../ui/Button";
import Table from "../password/Table";
import { useModal } from "../../hooks/useModal";
import useAuthStore from "../../store/authStore";
import PasswordModal from "../modals/PasswordModal";
import DeleteModal from "../modals/DeleteModal";
import {
  vaultCryptoService,
  vaultService,
  type PasswordItem,
} from "lockena-core";

function PasswordsPage() {
  const [passwords, setPasswords] = useState<PasswordItem[]>();
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(true);
    const result = await vaultService.getVaultItems();
    if (result.state === "success") {
      let decryptedItems: PasswordItem[] = [];
      if (masterKey) {
        decryptedItems = await Promise.all(
          result.data.items.map(async (item) => {
            const decrypted = await vaultCryptoService.decrypt(masterKey, item);
            decrypted.id = item.id;
            decrypted.updatedAtUtc = item.updatedAtUtc;
            return decrypted as PasswordItem;
          }),
        );
      }
      setPasswords(decryptedItems);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    (async function () {
      fetchPasswords();
    })();
  }, [fetchPasswords]);

  const addPassword = useCallback(
    async (password: PasswordItem) => {
      if (!masterKey) return;
      const dto = await vaultCryptoService.encrypt(masterKey, password);
      const result = await vaultService.createVaultItem(dto);
      if (result.state === "success" && passwords) {
        const filter = [...passwords];
        filter.push({
          id: result.data.id,
          ...password,
          updatedAtUtc: result.data.updatedAtUtc,
        });
        setPasswords(filter);
        hideModal();
      }
    },
    [masterKey, passwords, hideModal],
  );

  const editPassword = useCallback(
    async (id: string, password: PasswordItem) => {
      if (!masterKey) return;
      const dto = await vaultCryptoService.encrypt(masterKey, password);
      const result = await vaultService.updateVaultItem(id, dto);
      if (result.state === "success" && passwords) {
        const filter = passwords.filter((p) => p.id !== id);
        filter.push({
          id: result.data.id,
          ...password,
          updatedAtUtc: result.data.updatedAtUtc,
        });
        setPasswords(filter);
        hideModal();
      }
    },
    [hideModal, masterKey, passwords],
  );

  const deletePassword = useCallback(
    async (id: string) => {
      const result = await vaultService.deleteVaultItem(id);
      if (result.state === "success" && passwords) {
        const filter = passwords.filter((p) => p.id !== id);
        setPasswords(filter);
      }
    },
    [passwords],
  );

  const handleOpenPasswordModal = useCallback(
    (passwordEdit?: PasswordItem) => {
      showModal(
        <PasswordModal
          title={passwordEdit ? "Редактировать пароль" : "Добавить пароль"}
          onClose={() => {
            hideModal();
          }}
          onSave={(password: PasswordItem) => {
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
    (password: PasswordItem) => {
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
    if (!passwords) return;
    const delay = filterParams.search ? 300 : 0;

    const handler = setTimeout(() => {
      let filtered = [...passwords];
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
      setFilteredPasswords(filtered);
      setPagination((prev) => ({ ...prev, page: 1, total: filtered.length }));
    }, delay);

    return () => clearTimeout(handler);
  }, [passwords, filterParams]);

  const loadPage = useCallback((): PasswordItem[] => {
    const lastItemIndex = pagination.page * pagination.pageSize;
    const firstItemIndex = lastItemIndex - pagination.pageSize;
    const pageItems = filteredPasswords.slice(firstItemIndex, lastItemIndex);
    return pageItems;
  }, [filteredPasswords, pagination]);

  return (
    <>
      {passwords && passwords.length === 0 ? (
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
          {isLoading && <Loading title="Загрузка паролей..." />}
          {passwords &&
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
          {passwords &&
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
