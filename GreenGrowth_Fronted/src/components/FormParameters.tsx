import DropDownMenuOfIndustries from './DropDownMenu';
import Parameter from './Parameter';
import { parameterForm } from '../types/consts';

type FormTypeKeys = keyof typeof parameterForm;

interface FormPROPS {

    type: FormTypeKeys;
}

export default function FormParameters({ type }: FormPROPS) {
    // 1. Retrieve the configuration for the active type
    const config = parameterForm[type];
    
    if (!config) {
        return <div className="p-4 text-red-500">Error: Invalid form type provided.</div>;
    }

    const { color, parameters } = config;
    
    const borderStyle = {
        borderColor: color,
        borderWidth: '1px',
    };

    return(
        <div 
            className="bg-white rounded-xl p-4" 
            style={borderStyle} // Apply the dynamic border color
        >

            {parameters.map((param) => {

                
                if (param.type === "slider") {
                    const [min, max] = param.range ?? [0, 100];
                    return (
                        <Parameter 
                            key={param.name}
                            name={param.name} 
                            min_value={min} 
                            max_value={max}
                            useDecimal
                        />
                    );
                } 
                
                if (param.type === "dropdown-industry") {
                    return (
                        <DropDownMenuOfIndustries />
                    );
                }

                return null; 
            })}
        </div>
    );
}
        



