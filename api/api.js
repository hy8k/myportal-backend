const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getMemoList = async () => {
    const memoList = (await prisma.memo.findMany()).reduce((acc, memo) => {
        acc[memo.title] = { content: memo.content, id: memo.id };
        return acc;
    }, {});
    
    const sortedMemoList = Object.fromEntries(
        Object.entries(memoList).sort(([a], [b]) => a.localeCompare(b))
    );
    return sortedMemoList;
}

router.get("/list", async (req, res) => {
    const memoList = await getMemoList();
    res.send({ memoList: memoList })
});

router.post("/save", async (req, res) => {
    const memoTitle = req.body.memoTitle;
    const markdownText = req.body.markdownText;

    await prisma.memo.upsert({
        where: {
            title: memoTitle,
        },
        update: {
            content: markdownText
        },
        create: {
            title: memoTitle,
            content: markdownText
        }
    })

    const memoList = await getMemoList();
    res.send({ success: true, memoList: memoList })
});

router.post("/rename", async (req, res) => {
    const memoTitle = req.body.memoTitle;
    const newMemoTitle = req.body.newMemoTitle;
    const markdownText = req.body.markdownText;

    await prisma.memo.update({
        where: {
            title: memoTitle
        },
        data: {
            title: newMemoTitle,
            content: markdownText
        }
    })

    const memoList = await getMemoList();
    res.send({ success: true, memoList: memoList })
});
router.post("/delete", async (req, res) => {
    const memoTitle = req.body.memoTitle;

    await prisma.memo.delete({
        where: {
            title: memoTitle
        }
    })

    const memoList = await getMemoList();
    res.send({ success: true, memoList: memoList })
});

module.exports = router;