namespace Backend.Features.Customers;

public class CustomerListQuery : IRequest<List<CustomerListQueryResponse>>
{
    public string? SearchText { get; set; }
    public string? SortBy { get; set; }
    public bool? Descending { get; set; }
    public int? Skip { get; set; }
    public int? Take { get; set; }
    public CustomerListQuery()
    {
        Descending = PaginationDefaults.DEFAULT_DESCENDING;
        Skip = PaginationDefaults.DEFAULT_SKIP;
        Take = PaginationDefaults.DEFAULT_TAKE;
    }

}

public class CustomerListQueryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Iban { get; set; } = "";
    public CustomerListQueryResponseCategory? CustomerCategory { get; set; }
}


public class CustomerListQueryResponseCategory
{
    public string Code { get; set; } = "";
    public string Description { get; set; } = "";
}


internal class CustomerListQueryHandler (BackendContext context) : IRequestHandler<CustomerListQuery, List<CustomerListQueryResponse>>
{

    public async Task<List<CustomerListQueryResponse>> Handle(CustomerListQuery request, CancellationToken cancellationToken)
    {
        var query = context.Customers.AsQueryable();
        if (!string.IsNullOrEmpty(request.SearchText)) {
            query = query.Where(q => 
                q.Name.ToLower().Contains(request.SearchText.ToLower()) ||
                q.Email.ToLower().Contains(request.SearchText.ToLower())
            );
        }

        
        if (!string.IsNullOrEmpty(request.SortBy)) {
            
            switch (request.SortBy.ToLower().Trim()) {
                case "email":
                    query = request.Descending ?? PaginationDefaults.DEFAULT_DESCENDING
                            ? query.OrderByDescending(q => q.Email)
                            : query.OrderBy(q => q.Email);
                break;

                default:
                    query = request.Descending ?? PaginationDefaults.DEFAULT_DESCENDING
                            ? query.OrderByDescending(q => q.Name)
                            : query.OrderBy(q => q.Name);
                break;
            }

        }
        

        query = query.Skip(request.Skip ?? PaginationDefaults.DEFAULT_SKIP)
                     .Take(request.Take ?? PaginationDefaults.DEFAULT_TAKE);
        


        var data = await query.ToListAsync(cancellationToken);

        var result = new List<CustomerListQueryResponse>();

        foreach (var item in data)
        {
            var resultItem = new CustomerListQueryResponse
            {
                Id = item.Id,
                Name = item.Name,
                Address = item.Address,
                Email = item.Email,
                Phone = item.Phone,
                Iban = item.Iban,
            };

            var category = await context.CustomerCategories.SingleOrDefaultAsync(q => q.Id == item.CustomerCategoryId, cancellationToken);
            if (category is not null)
                resultItem.CustomerCategory = new CustomerListQueryResponseCategory
                {
                    Code = category.Code,
                    Description = category.Description
                };


            result.Add(resultItem);
        }
        

        return result;
    }

}
