import * as Yup from "yup";

export interface AuditFormValues {
   insuranceProvider?: string;
   coverageAmount?: string;
   coverageStart?: string;
   coverageEnd?: string;
   notes?: string;
}

export const validationSchema = Yup.object({
    insuranceProvider: Yup.string().required("Required"),
    coverageAmount: Yup.string().required("Required"),
    coverageStart: Yup.string().required('Start date is required'),
    coverageEnd: Yup.string().required('End date is required'),
    notes: Yup.string(),
});

export const initialValues: AuditFormValues = {
    insuranceProvider: "",
    coverageAmount: "",
    coverageStart: "",
    coverageEnd: "",
    notes: "",
};
