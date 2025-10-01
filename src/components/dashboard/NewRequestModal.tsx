import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/lib/store';
import { PlusCircle, Paperclip, Loader2 } from 'lucide-react';
const requestSchema = z.object({
  amount: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number({ invalid_type_error: 'Amount is required' }).positive({ message: 'Amount must be positive' })
  ),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  reason: z.string().min(10, { message: 'Reason must be at least 10 characters' }),
});
type RequestFormData = z.infer<typeof requestSchema>;
export function NewRequestModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addRequest = useAppStore(state => state.addRequest);
  const { control, handleSubmit, register, formState: { errors }, reset } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      amount: undefined, // Use undefined to show placeholder
      currency: 'USD',
      reason: '',
    },
  });
  const onSubmit: SubmitHandler<RequestFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await addRequest(data);
      reset();
      setOpen(false);
    } catch (error) {
      // Error is already toasted in the store
      console.error("Failed to submit request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        setOpen(isOpen);
        if (!isOpen) reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Petty Cash Request</DialogTitle>
          <DialogDescription>Fill out the form below to request funds.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <div className="col-span-3">
              <Input id="amount" type="number" step="0.01" placeholder="e.g., 50.00" {...register('amount')} className={errors.amount ? 'border-red-500' : ''} />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">Currency</Label>
            <div className="col-span-3">
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">Reason</Label>
            <div className="col-span-3">
              <Textarea id="reason" placeholder="e.g., Office supplies for Q3" {...register('reason')} className={errors.reason ? 'border-red-500' : ''} />
              {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Attachment</Label>
            <div className="col-span-3">
              <Button type="button" variant="outline" className="w-full justify-start text-gray-500">
                <Paperclip className="mr-2 h-4 w-4" />
                Attach receipt (optional)
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}