namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IBookRepository BookRepository {get;}
        IAdvertisementRepository AdvertisementRepository {get;}
        Task<Boolean> Complete();
        bool HasChanges();
    }
}
