import asyncio
import platform
import re
import shutil
from dataclasses import dataclass


class TracerouteError(RuntimeError):
    """Base traceroute exception."""


class TracerouteUnavailableError(TracerouteError):
    """Raised when traceroute tooling is not available on the host."""


class TracerouteTimeoutError(TracerouteError):
    """Raised when the traceroute command exceeds the allowed timeout."""


@dataclass(slots=True)
class TracerouteResult:
    target: str
    hops: list[tuple[int, str]]
    raw_output: str


HOP_PATTERN = re.compile(r"^\s*(\d+)\s+(.*)$")


async def run_traceroute(
    host: str,
    *,
    max_hops: int = 20,
    timeout: float = 25.0,
) -> TracerouteResult:
    """Execute traceroute/tracert command and parse its output."""
    system = platform.system().lower()
    if system == "windows":
        executable = shutil.which("tracert")
        if not executable:
            raise TracerouteUnavailableError("tracert command not found.")
        command = [executable, "-h", str(max_hops), host]
    else:
        executable = shutil.which("traceroute")
        if not executable:
            raise TracerouteUnavailableError("traceroute command not found.")
        command = [executable, "-m", str(max_hops), host]

    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    try:
        stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=timeout)
    except asyncio.TimeoutError as exc:
        process.kill()
        raise TracerouteTimeoutError("Traceroute command timed out.") from exc

    if process.returncode not in (0, 1):
        # Some traceroute binaries return 1 when the trace is incomplete; treat as warning.
        message = stderr.decode("utf-8", errors="ignore").strip()
        raise TracerouteError(message or "Traceroute command failed.")

    raw_output = stdout.decode("utf-8", errors="ignore")
    hops: list[tuple[int, str]] = []
    for line in raw_output.splitlines():
        match = HOP_PATTERN.match(line)
        if match:
            hop_number = int(match.group(1))
            details = match.group(2).strip()
            hops.append((hop_number, details))

    return TracerouteResult(target=host, hops=hops, raw_output=raw_output)
