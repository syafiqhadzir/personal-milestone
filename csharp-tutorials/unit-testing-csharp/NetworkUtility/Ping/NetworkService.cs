namespace NetworkUtility.Ping
{
    public class NetworkService
    {
        public string SendPing()
        {
            // SearchDNS();
            // BuildPacket()
            return "Success: Ping sent!";
        }

        public int PingTimeout(int a, int b)
        {
            return a + b;
        }
    }
}