import logger


def __fixup_ids(index):
    for ind, x in enumerate(index):
        x["id"] = ind
        yield x


def execute(run_index, prev_master_index):
    """
    Given the run_index prev_master_index, merge and return

    To be done: Optimize: Check for collisions
    - Between image hashes from this run
    - Between url_ids
    """
    logger.warning("TODO: Check for collisions between image hashes.")
    logger.warning("TODO: Check for collisions between url_ids.")
    logger.info(f"Previous master index has: {len(prev_master_index)} entries.")
    logger.info(f"Run index has: {len(prev_master_index)} entries.")
    new_master_index = run_index + prev_master_index
    new_master_index = list(__fixup_ids(new_master_index))
    logger.info(f"New master index has: {len(prev_master_index)} entries.")
    return new_master_index
