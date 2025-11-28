using Backend.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.ModelBinders
{
    public class GrowthHabitModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).FirstValue;
            if (string.IsNullOrWhiteSpace(value))
            {
                bindingContext.Result = ModelBindingResult.Success(null);
                return Task.CompletedTask;
            }

            GrowthHabit result;

            if (value == "Forb/herb")
            {
                result = GrowthHabit.ForbHerb;
            }
            else if (!Enum.TryParse(value, ignoreCase: true, out result))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"Invalid GrowthHabit: {value}");
                bindingContext.Result = ModelBindingResult.Failed();
                return Task.CompletedTask;
            }

            bindingContext.Result = ModelBindingResult.Success(result);
            return Task.CompletedTask;
        }
    }
}
