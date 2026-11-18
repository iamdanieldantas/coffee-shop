"""Gate de qualidade para review e release do Coffee House."""
import argparse, datetime, json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def execute(command):
    p=subprocess.run(command,cwd=ROOT,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    print(p.stdout,flush=True)
    return {'cmd':' '.join(command),'ok':p.returncode==0,'output':p.stdout[-10000:]}
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--mode',choices=['review','release'],required=True)
    parser.add_argument('--browser',action='store_true')
    args=parser.parse_args()
    results=[execute([sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py','-v'])]
    if args.browser and results[-1]['ok']:
        results.append(execute([sys.executable,'-m','tests.browser_smoke']))
        if results[-1]['ok']:
            results.append(execute([sys.executable,'-m','tests.browser_v2']))
            if results[-1]['ok']:
                results.append(execute([sys.executable,'-m','tests.browser_pwa']))
                if results[-1]['ok']:
                    results.append(execute([sys.executable,'-m','tests.browser_admin']))
                    if results[-1]['ok']:
                        results.append(execute([sys.executable,'-m','tests.browser_polish']))
    passed=all(x['ok'] for x in results)
    dest=ROOT/'_reports'/'harness-report.json';dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps({'mode':args.mode,'passed':passed,'timestamp':datetime.datetime.now(datetime.timezone.utc).isoformat(),'checks':results},indent=2,ensure_ascii=False))
    return 0 if passed else 1
if __name__=='__main__':sys.exit(main())
