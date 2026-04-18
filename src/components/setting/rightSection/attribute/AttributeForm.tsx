import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { AttributeField, AttributeType } from "@/store/slices/attributeSlice/attributeType";
import { Modal, Button } from "react-bootstrap";

type props={
    isOpen:boolean
    onClose:()=>void
}
const AttributeForm = ({isOpen,onClose}:props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentAttribute } = useSelector(
    (state: RootState) => state.attribute
  );

  const [form, setForm] = useState<AttributeType>({
    key: "",
    name: "",
    appliesTo: "product",
    contexts: [],
    attributes: [],
    isSystem: false,
    source: "",
  });

  // ✅ Load data for edit
  useEffect(() => {
    if (currentAttribute) {
      setForm(currentAttribute);
    }
  }, [currentAttribute]);

  // ✅ Handle basic fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle attribute field change
  const handleAttributeChange = (
    index: number,
    field: keyof AttributeField,
    value: any
  ) => {
    const updatedAttributes = [...(form.attributes || [])];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [field]: value,
    };

    setForm((prev) => ({
      ...prev,
      attributes: updatedAttributes,
    }));
  };

  // ✅ Add new attribute field
  const addAttributeField = () => {
    const newField: AttributeField = {
      key: "",
      label: "",
      type: "text",
      hint: "",
      show: true,
      isActive: true,
    };

    setForm((prev) => ({
      ...prev,
      attributes: [...(prev.attributes || []), newField],
    }));
  };

  // ✅ Remove attribute field
  const removeAttributeField = (index: number) => {
    const updated = [...(form.attributes || [])];
    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      attributes: updated,
    }));
  };

  // ✅ Submit
  const handleSubmit = () => {
    // if (currentAttribute?._id) {
    //   dispatch(updateAttribute({ id: currentAttribute._id, data: form }));
    // } else {
    //   dispatch(createAttribute(form));
    // }
  };

  return (
    <>
      <Modal show={isOpen} onHide={onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAttribute ? "Edit Attribute" : "Create Attribute"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="max-h-[80vh] overflow-y-auto">
      
      {/* Basic Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="key"
          value={form.key || ""}
          onChange={handleChange}
          placeholder="Key"
          className="border p-2"
        />

        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2"
        />

        <input
          name="source"
          value={form.source || ""}
          onChange={handleChange}
          placeholder="Source"
          className="border p-2"
        />
      </div>

      {/* Attributes */}
      <h3 className="font-semibold mb-2">Attributes</h3>

      {form.attributes?.map((attr, index) => (
        <div
          key={index}
          className="border p-4 mb-3 rounded bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-3">
            
            <input
              value={attr.key || ""}
              onChange={(e) =>
                handleAttributeChange(index, "key", e.target.value)
              }
              placeholder="Key"
              className="border p-2"
            />

            <input
              value={attr.label || ""}
              onChange={(e) =>
                handleAttributeChange(index, "label", e.target.value)
              }
              placeholder="Label"
              className="border p-2"
            />

            <select
              value={attr.type || "text"}
              onChange={(e) =>
                handleAttributeChange(index, "type", e.target.value)
              }
              className="border p-2"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>

            <input
              value={attr.hint || ""}
              onChange={(e) =>
                handleAttributeChange(index, "hint", e.target.value)
              }
              placeholder="Hint"
              className="border p-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={attr.show || false}
                onChange={(e) =>
                  handleAttributeChange(index, "show", e.target.checked)
                }
              />
              Show
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={attr.isActive || false}
                onChange={(e) =>
                  handleAttributeChange(index, "isActive", e.target.checked)
                }
              />
              Active
            </label>
          </div>

          <button
            onClick={() => removeAttributeField(index)}
            className="text-red-500 mt-2"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addAttributeField}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Add Field
      </button>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2"
        >
          {currentAttribute ? "Update" : "Create"}
        </button>
      </div>

          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AttributeForm;