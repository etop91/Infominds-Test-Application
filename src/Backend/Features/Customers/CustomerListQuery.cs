namespace Backend.Features.Customers;

public class CustomerListQuery : IRequest<List<CustomerListQueryResponse>>
{
    public string? SearchText { get; set; }
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

/*
internal class CustomerListQueryHandler (BackendContext context) : IRequestHandler<CustomersListQuery, List<CustomersListQueryResponse>>
{
    private readonly BackendContext context = context;

    public async Task<List<CustomerListQueryResponse>> Handle(CustomerListQuery request, CancellationToken cancellationToken)
    {
        var query = context.Customers.AsQueryable();
        if (!string.IsNullOrEmpty(request.SearchText)) {
            query = query.Where(q => q.Name.ToLower().Contains(request.SearchText.ToLower()));
            query = query.Where(q => q.Email.ToLower().Contains(request.SearchText.ToLower()));
        }

        var data = await query.OrderBy(q => q.Name).ThenBy(q => q.Email).ToListAsync(cancellationToken);
        var result = new List<CustomerListQueryResponse>();

        foreach (var item in data)
        {
            var resultItem = new CustomerListQueryResponse
            {
                Id = item.Id,
                Code = item.Code,
                FirstName = item.FirstName,
                LastName = item.LastName,
                Address = item.Address,
                Email = item.Email,
                Phone = item.Phone,
            };

            var category = await context.CustomerCategories.SingleOrDefaultAsync(q => q.Id == item.DepartmentId, cancellationToken);
            if (category is not null)
                resultItem.Department = new CustomerListQueryResponseCategory
                {
                    Code = category.Code,
                    Description = category.Description
                };


            result.Add(resultItem);
        }
        

        return result;
    }

}
*/