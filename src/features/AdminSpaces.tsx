import React, { useEffect, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { createSpace, deleteSpace, updateSpace } from "src/actions/admin";
import { Card, CardTitle, CardBody } from "src/components/Card";
import Input from "src/components/Input";
import HStack from "src/components/HStack";
import Stack from "src/components/Stack";
import SvgIcon from "src/components/SvgIcon";

import plusIcon from "@tabler/icons/outline/plus.svg";
import editIcon from "@tabler/icons/outline/edit.svg";
import trashIcon from "@tabler/icons/outline/trash.svg";
import checkIcon from "@tabler/icons/outline/check.svg";
import xIcon from "@tabler/icons/outline/x.svg";
import { fetchAllSpaces } from "src/actions/spaces";
import { Column } from "src/components/Column";

const messages = defineMessages({
  title: { id: "admin.spaces.title", defaultMessage: "Manage Spaces" },
  createSpace: { id: "admin.spaces.create", defaultMessage: "Create Space" },
  editSpace: { id: "admin.spaces.edit", defaultMessage: "Edit Space" },
  deleteSpace: { id: "admin.spaces.delete", defaultMessage: "Delete Space" },
  spaceId: { id: "admin.spaces.id", defaultMessage: "Space ID" },
  spaceName: { id: "admin.spaces.name", defaultMessage: "Space Name" },
  confirm: { id: "admin.spaces.confirm", defaultMessage: "Confirm" },
  cancel: { id: "admin.spaces.cancel", defaultMessage: "Cancel" },
  deleteConfirm: {
    id: "admin.spaces.delete_confirm",
    defaultMessage: "Are you sure you want to delete this space?",
  },
});

const AdminSpaces: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "" });

  const spaces = useAppSelector((state) => state.spaces.valueSeq().toArray());

  useEffect(() => {
    dispatch(fetchAllSpaces());
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      const spaceData = {
        id: formData.id,
        name: formData.name,
      };

      await dispatch(createSpace(spaceData));
      setIsCreating(false);
      setFormData({ id: "", name: "" });
      dispatch(fetchAllSpaces());
    } catch (error) {
      console.error("Failed to create space:", error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      await dispatch(updateSpace(id, { name: formData.name }));
      setEditingId(null);
      setFormData({ id: "", name: "" });
      dispatch(fetchAllSpaces());
    } catch (error) {
      console.error("Failed to update space:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSpace(id));
      setDeletingId(null);
      dispatch(fetchAllSpaces());
    } catch (error) {
      console.error("Failed to delete space:", error);
    }
  };

  const startEdit = (space: any) => {
    setEditingId(space.id);
    setFormData({ id: space.id, name: space.name });
  };

  return (
    <Column>
      <Stack space={4} className="p-4">
        <HStack justifyContent="between" alignItems="center">
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
          >
            <SvgIcon src={plusIcon} className="size-4 mr-2" />
            {intl.formatMessage(messages.createSpace)}
          </button>
        </HStack>

        {isCreating && (
          <Card>
            <CardBody>
              <Stack space={4}>
                <Input
                  type="text"
                  placeholder={intl.formatMessage(messages.spaceId)}
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder={intl.formatMessage(messages.spaceName)}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <HStack justifyContent="end" space={2}>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-md border border-gray-300"
                  >
                    <SvgIcon src={xIcon} className="size-4" />
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 rounded-md bg-primary-600 text-white"
                  >
                    <SvgIcon src={checkIcon} className="size-4" />
                  </button>
                </HStack>
              </Stack>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <Card key={space.id}>
              <CardBody>
                {editingId === space.id ? (
                  <Stack space={4}>
                    <Input
                      type="text"
                      placeholder={intl.formatMessage(messages.spaceName)}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <HStack justifyContent="end" space={2}>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-md border border-gray-300"
                      >
                        <SvgIcon src={xIcon} className="size-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(space.id)}
                        className="px-4 py-2 rounded-md bg-primary-600 text-white"
                      >
                        <SvgIcon src={checkIcon} className="size-4" />
                      </button>
                    </HStack>
                  </Stack>
                ) : (
                  <Stack space={2}>
                    <h3 className="text-lg font-semibold">{space.name}</h3>
                    <p className="text-sm text-gray-500">{space.id}</p>
                    <HStack justifyContent="end" space={2}>
                      <button
                        onClick={() => startEdit(space)}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <SvgIcon src={editIcon} className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(space.id)}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <SvgIcon src={trashIcon} className="size-4" />
                      </button>
                    </HStack>
                  </Stack>
                )}

                {deletingId === space.id && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm mb-4">
                      {intl.formatMessage(messages.deleteConfirm)}
                    </p>
                    <HStack justifyContent="end" space={2}>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-4 py-2 rounded-md border border-gray-300"
                      >
                        {intl.formatMessage(messages.cancel)}
                      </button>
                      <button
                        onClick={() => handleDelete(space.id)}
                        className="px-4 py-2 rounded-md bg-danger-600 text-white"
                      >
                        {intl.formatMessage(messages.deleteSpace)}
                      </button>
                    </HStack>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </Stack>
    </Column>
  );
};

export default AdminSpaces;
