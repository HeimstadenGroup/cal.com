import { TrashIcon } from "@heroicons/react/solid";
import { ChangeEvent } from "react";
import {
  FieldProps,
  ConjsProps,
  ButtonProps,
  ButtonGroupProps,
  ProviderProps,
  SelectWidgetProps,
  NumberWidgetProps,
  TextWidgetProps,
  Utils as QbUtils,
} from "react-awesome-query-builder";

import { Button as CalButton } from "@calcom/ui";
import { Input } from "@calcom/ui/form/fields";

// import { mapListValues } from "../../../../utils/stuff";
import { SelectWithValidation as Select } from "@components/ui/form/Select";

const TextAreaWidget = (props: TextWidgetProps) => {
  const { value, setValue, readonly, placeholder, maxLength, customProps, ...remainingProps } = props;

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
  };

  const textValue = value || "";
  return (
    <textarea
      value={textValue}
      placeholder={placeholder}
      disabled={readonly}
      onChange={onChange}
      maxLength={maxLength}
      className="flex flex-grow border-gray-300 text-sm"
      {...customProps}
      {...remainingProps}
    />
  );
};

const TextWidget = (props: TextWidgetProps & { type?: string }) => {
  const { value, setValue, config, readonly, placeholder, customProps, ...remainingProps } = props;
  let { type } = props;
  type = type || "text";
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
  };
  const textValue = value || "";
  return (
    <input
      type={type}
      className="flex flex-grow border-gray-300 text-sm"
      value={textValue}
      placeholder={placeholder}
      disabled={readonly}
      onChange={onChange}
      {...remainingProps}
      {...customProps}
    />
  );
};

function NumberWidget({ value, setValue, ...remainingProps }: NumberWidgetProps) {
  return (
    <Input
      name="query-builder"
      type="number"
      className="mt-0"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      {...remainingProps}></Input>
  );
}

const MultiSelectWidget = ({
  listValues,
  setValue,
  value,
}: SelectWidgetProps & {
  listValues: { title: string; value: string }[];
}) => {
  //TODO: Use Select here.
  //TODO: Let's set listValue itself as label and value instead of using title.
  if (!listValues) {
    return null;
  }
  const selectItems = listValues.map((item) => {
    return {
      label: item.title,
      value: item.value,
    };
  });

  const defaultValue = selectItems.filter((item) => value?.includes(item.value));

  return (
    <Select
      menuPosition="fixed"
      onChange={(items) => {
        setValue(items?.map((item) => item.value));
      }}
      defaultValue={defaultValue}
      isMulti={true}
      options={selectItems}></Select>
  );
};

function SelectWidget({
  listValues,
  setValue,
  value,
  ...remainingProps
}: SelectWidgetProps & {
  listValues: { title: string; value: string }[];
}) {
  if (!listValues) {
    return null;
  }
  const selectItems = listValues.map((item) => {
    return {
      label: item.title,
      value: item.value,
    };
  });
  const defaultValue = selectItems.find((item) => item.value === value);

  return (
    <Select
      className="block w-full min-w-0 flex-1 rounded-none rounded-r-sm border-gray-300 sm:text-sm"
      menuPosition="fixed"
      onChange={(item) => {
        if (!item) {
          return;
        }
        setValue(item.value);
      }}
      defaultValue={defaultValue}
      options={selectItems}
      {...remainingProps}></Select>
  );
}

function Button({ type, label, onClick, readonly }: ButtonProps) {
  if (type === "delRule" || type == "delGroup") {
    return (
      <button className="ml-5">
        <TrashIcon className="m-0 h-4 w-4 text-neutral-500" onClick={onClick}></TrashIcon>
      </button>
    );
  }
  if (type === "addRule") {
    label = "Add rule";
  } else if (type == "addGroup") {
    label = "Add rule group";
  }
  return (
    <CalButton type="button" color="secondary" size="sm" disabled={readonly} onClick={onClick}>
      {label}
    </CalButton>
  );
}

function ButtonGroup({ children }: ButtonGroupProps) {
  if (!(children instanceof Array)) {
    return null;
  }
  return (
    <>
      {children.map((button) => {
        if (!button) {
          return null;
        }
        return button;
      })}
    </>
  );
}

function Conjs({ not, setNot, config, conjunctionOptions, setConjunction, disabled }: ConjsProps) {
  if (!config || !conjunctionOptions) {
    return null;
  }
  const conjsCount = Object.keys(conjunctionOptions).length;

  const lessThenTwo = disabled;
  const { forceShowConj } = config.settings;
  const showConj = forceShowConj || (conjsCount > 1 && !lessThenTwo);
  const options = [
    { label: "All", value: "all" },
    { label: "Any", value: "any" },
    { label: "None", value: "none" },
  ];
  const renderOptions = () => {
    const { checked: andSelected } = conjunctionOptions["AND"];
    const { checked: orSelected } = conjunctionOptions["OR"];
    const notSelected = not;
    // Default to All
    let value = andSelected ? "all" : orSelected ? "any" : "all";

    if (notSelected) {
      // not of All -> None
      // not of Any -> All
      value = value == "any" ? "none" : "all";
    }
    const selectValue = options.find((option) => option.value === value);

    return (
      <div className="flex items-center text-sm">
        <span>Rule group when</span>
        <Select
          className="flex px-2"
          defaultValue={selectValue}
          options={options}
          onChange={(option) => {
            if (!option) return;
            if (option.value === "all") {
              setConjunction("AND");
              setNot(false);
            } else if (option.value === "any") {
              setConjunction("OR");
              setNot(false);
            } else if (option.value === "none") {
              setConjunction("OR");
              setNot(true);
            }
          }}></Select>
        <span>match</span>
      </div>
    );
  };

  return showConj ? renderOptions() : null;
}

const FieldSelect = function FieldSelect(props: FieldProps) {
  const { items, setField, selectedKey } = props;
  const selectItems = items.map((item) => {
    return {
      ...item,
      value: item.key,
    };
  });

  const defaultValue = selectItems.find((item) => {
    return item.value === selectedKey;
  });

  return (
    <Select
      menuPosition="fixed"
      onChange={(item) => {
        if (!item) {
          return;
        }
        setField(item.value);
      }}
      defaultValue={defaultValue}
      options={selectItems}></Select>
  );
};

const Provider = ({ children }: ProviderProps) => children;

const widgets = {
  TextWidget,
  TextAreaWidget,
  SelectWidget,
  NumberWidget,
  MultiSelectWidget,
  FieldSelect,
  Button,
  ButtonGroup,
  Conjs,
  Provider,
};

export default widgets;
