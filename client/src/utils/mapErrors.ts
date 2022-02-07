import { FieldError } from "../generated/graphql";

// Cool array of errors
export const mapErrors = (errors: FieldError[]) => {
    const mapErrors: Record<string, string> = {};

    errors.forEach(({field, message}) => {
        mapErrors[field] = message;
    });

    return mapErrors;
};
