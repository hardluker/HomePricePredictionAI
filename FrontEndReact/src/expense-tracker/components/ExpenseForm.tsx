import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import categories from './categories';

//Zod Schema for validation rules
const schema = z.object({
  //Define validation rules for 'Description' field
  description: z
    .string() // Ensure input is string
    .min(3, { message: 'Description must be at least 3 characters' }) //Defining min character limit and message
    .max(50, { message: 'Maximum characters is 50' }), //Defining max character limit and message

  //Define validation rules for 'amount' field
  amount: z
    .number({ invalid_type_error: 'Amount is required.' }) //Ensuring input is number and defining validation message
    .min(0.01) //Min value
    .max(100_000), //Max value

  //Define validation rules for 'category' field
  //Ensuring the only submitted values are the values in the categories
  category: z.enum(categories, {
    errorMap: () => ({ message: 'Category is required' })
  })
});

//Infering the schema of the form to reduce boilerplate
type ExpenseFormData = z.infer<typeof schema>;

//Interface for passing the onSubmit function to the parents
//This function passes the data of the form
interface Props {
  onSubmit: (data: ExpenseFormData) => void;
}

export const ExpenseForm = ({ onSubmit }: Props) => {
  //Extracting functions and values from the useForm hook
  const {
    register, // Function to register form inputs in the schema
    handleSubmit, // Function to handle form submission
    reset, // Function to reset the form
    formState: { errors } //Destructured errors from the form state
  } = useForm<ExpenseFormData>({ resolver: zodResolver(schema) });

  // Form component for expense submission
  return (
    <form
      // Handling form submission with validation
      onSubmit={handleSubmit((data) => {
        // On form submission, call the onSubmit function with the form data
        onSubmit(data);
        // Reset the form after submission
        reset();
      })}
    >
      {/* Description input field */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          {...register('description')} // Registering the description input field with useForm
          id="description"
          type="text"
          className="form-control"
        />
        {/* Displaying validation error message if any */}
        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}
      </div>

      {/* Amount input field */}
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          {...register('amount', { valueAsNumber: true })} // Registering amount input with useForm
          id="amount"
          type="number"
          step="0.01" // Allowing decimal input with step size of 0.01
          className="form-control"
        />
        {/* Displaying validation error message if any */}
        {errors.amount && (
          <p className="text-danger">{errors.amount.message}</p>
        )}
      </div>

      {/* Category selection dropdown */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select {...register('category')} id="category" className="form-select">
          {/* Displaying options for categories */}
          <option value=""></option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {/* Displaying validation error message if any */}
        {errors.category && (
          <p className="text-danger">{errors.category.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};
