from fastapi import APIRouter, HTTPException, Depends
from pms.services.notice_services import notice_mgr
from pms.models.notice import Notice
from typing import List

router = APIRouter()

async def get_notice_mgr():
    if notice_mgr.notices_collection is None:
        await notice_mgr.initialize()
    return notice_mgr

@router.post("/add", response_model=str)
async def create_notice(notice: Notice, mgr=Depends(get_notice_mgr)):
    try:
        return await mgr.create_notice(notice)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get", response_model=List[dict])
async def get_notices(mgr=Depends(get_notice_mgr)):
    try:
        return await mgr.get_all_notices()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{notice_id}")
async def update_notice(notice_id: str, notice: Notice, mgr=Depends(get_notice_mgr)):
    try:
        await mgr.update_notice(notice_id, notice.model_dump(exclude_unset=True))
        return {"msg": "Notice updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{notice_id}")
async def delete_notice(notice_id: str, mgr=Depends(get_notice_mgr)):
    try:
        await mgr.delete_notice(notice_id)
        return {"msg": "Notice deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))