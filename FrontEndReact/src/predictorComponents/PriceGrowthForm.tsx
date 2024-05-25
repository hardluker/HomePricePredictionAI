import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './PriceGrowthForm.css';

// Sample states array
//const states = ['State 1', 'State 2', 'State 3'];

// Zod Schema for validation rules
const schema = z.object({
  state: z.string().min(1, { message: 'State is required' }),

  startPrice: z
    .number({ invalid_type_error: 'Price is required' })
    .min(0, { message: 'Home price must be greater than or equal to 0' }),

  startDate: z.string().min(10, { message: 'Must be a full length address' }),
  endDate: z.string().min(10, { message: 'Must be a full length address' })
});

// Infering the schema of the form to reduce boilerplate
type FormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormValues) => void;
  states: string[];
}

export const PriceGrowthForm = ({ onSubmit, states }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form
      className="form"
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        //reset();
      })}
    >
      <div className="form-item mb-3">
        <label htmlFor="state" className="form-label">
          State
        </label>
        <select {...register('state')} id="state" className="form-select">
          <option value=""></option>
          {states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-danger">{errors.state.message}</p>}
      </div>

      <div className=" form-item mb-3">
        <label htmlFor="startPrice" className="form-label">
          Home Price
        </label>
        <input
          {...register('startPrice', { valueAsNumber: true })}
          id="startPrice"
          type="number"
          className="form-control"
          step="0.01"
        />
        {errors.startPrice && (
          <p className="text-danger">{errors.startPrice.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">
          Start Date
        </label>
        <input
          {...register('startDate')}
          id="startDate"
          type="date"
          className="form-control"
        />
        {errors.startDate && (
          <p className="text-danger">{errors.startDate.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">
          End Date
        </label>
        <input
          {...register('endDate')}
          id="endDate"
          type="date"
          className="form-control"
        />
        {errors.endDate && (
          <p className="text-danger">{errors.endDate.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
};
