namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IBookRepository BookRepository {get;}
        IAdvertisementRepository AdvertisementRepository {get;}
        IClubRepository ClubRepository {get;}
        Task<Boolean> Complete();
        bool HasChanges();
    }
}
