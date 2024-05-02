import time


def retry(func, retry_count, retry_seconds, job_name=None):
    result = None
    retries = 0
    while retries <= retry_count:
        try:
            result = func()
            break
        except Exception:
            if retries == retry_count:
                raise
            retries = retries + 1
            if job_name is not None:
                print(f'{job_name} failed, retrying ({retries} of {retry_count})')
            time.sleep(retry_seconds)
            continue
    return result
