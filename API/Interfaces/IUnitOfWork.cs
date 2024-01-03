namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        Task<Boolean> Complete();
        bool HasChanges();
    }
}
