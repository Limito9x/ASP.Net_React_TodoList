namespace MyFirstProject.Server.Models
{
    public enum LinkedEntityType
    {
        PLAN,
        PHASE,
        SINGLE_TASK,
        TASK_LOG
    }
    public class TagLink: BaseSimpleEntity
    {
        public int TagId { get; set; }
        public required Tag Tag { get; set; }
        public int LinkedEntityId { get; set; }
        public LinkedEntityType LinkedEntityType { get; set; }
    }
}
