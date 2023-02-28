using System.Net.NetworkInformation;

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

        public DateTime LastPingDate()
        {
            return DateTime.Now;
        }

        public PingOptions GetPingOptions()
        {
            return new PingOptions()
            {
                DontFragment = true,
                Ttl = 1000
            };
        }

        public IEnumerable<PingOptions> MostRecentPings()
        {
            IEnumerable<PingOptions> pingOptions = new[]
            {
                new PingOptions()
                {
                    DontFragment = true,
                    Ttl = 1000
                },
                new PingOptions()
                {
                    DontFragment = true,
                    Ttl = 1000
                },
                new PingOptions()
                {
                    DontFragment = true,
                    Ttl = 1000
                },
            };
            return pingOptions;
        }
    }
}