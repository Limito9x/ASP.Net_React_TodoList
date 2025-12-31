namespace MyFirstProject.Server.Models.Enums
{
    public enum UpdateStrategy
    {
        Absolute, // Theo dõi trạng thái, chỉ số mỗi lần thực hiện
        Cumulative // Cộng dồng tích lũy thêm mỗi lần thực hiện
    }
}
