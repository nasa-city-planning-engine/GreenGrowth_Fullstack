import DropDownMenuOfIndustries from "../DropDownMenu";
import Parameter from "../Parameter";
import { parameterForm } from "../../../types/consts";
import { useFormParameters } from "../../../others/simulationProvider";

type FormTypeKeys = keyof typeof parameterForm;

interface FormPROPS {
  type: FormTypeKeys;
}

export default function FormParameters({ type }: FormPROPS) {
  const config = parameterForm[type];
  const { formParameters, setFormParameters } = useFormParameters();

  if (!config) {
    return (
      <div className="p-4 text-red-500">Error: Invalid form type provided.</div>
    );
  }

  const { color, parameters } = config;

  const borderStyle = {
    borderColor: color,
    borderWidth: "1px",
  };

  const handleValueChange = (key: string, value: any) => {
    setFormParameters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      className="bg-white rounded-xl p-4"
      style={borderStyle} // Apply the dynamic border color
    >
      {parameters.map((param) => {
        if (param.type === "slider") {
          const [min, max] = param.range ?? [0, 100];
          return (
            <Parameter
              key={param.key}
              paramKey={param.key}
              name={param.name}
              min_value={min}
              max_value={max}
              useDecimal
              onValuesChange={handleValueChange}
            />
          );
        }
        if (param.type === "bool") {
          return (
            <label key={param.key} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={formParameters[param.key] ?? false}
                onChange={(e) => handleValueChange(param.key, e.target.checked)}
              />
              {param.name}
            </label>
          );
        }

        if (param.type === "dropdown-industry") {
          return (
            <DropDownMenuOfIndustries
              key={param.key}
              selected={formParameters[param.key] ?? []}
              onSelect={(values: string[]) =>
                handleValueChange(param.key, values)
              }
            />
          );
        }

        return null;
      })}
    </div>
  );
}
