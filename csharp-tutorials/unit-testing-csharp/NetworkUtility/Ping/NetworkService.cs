using NetworkUtility.DNS;
using System.Net.NetworkInformation;

namespace NetworkUtility.Ping
{
    public class NetworkService
    {
        private readonly IDNS _dNS;

        public NetworkService(IDNS dNS)
        {
            _dNS = dNS;
        }

        public string SendPing()
        {
            var dnsSuccess = _dNS.SendDNS();
            if (dnsSuccess)
                return "Success: Ping sent!";
            else

                return "Failed: Ping not sent!";
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